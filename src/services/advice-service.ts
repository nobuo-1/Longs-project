import { prisma } from "@/src/lib/prisma"
import { getWeekEnd, formatWeekRange } from "@/src/lib/news-week"
import { generateFactorAnalysis, generateNewsSummary } from "@/src/lib/gemini"
import { listActiveQueries } from "@/src/services/news-service"
import type { FactorType, NewsImpact } from "@prisma/client"

export type { FactorType }

export interface FactorQueryConfigDTO {
  id: string
  factorType: FactorType
  queryGroupId: string
  createdAt: Date
}

export interface WeeklyFactorAnalysisDTO {
  id: string
  weekStart: Date
  factorType: FactorType
  queryId: string
  content: string
  impact: NewsImpact
  generatedAt: Date
}

// ─── FactorQueryConfig CRUD ───────────────────────────────────

/** 全 FactorQueryConfig を取得 */
export async function getFactorConfigs(): Promise<FactorQueryConfigDTO[]> {
  const rows = await prisma.factorQueryConfig.findMany({
    orderBy: [{ factorType: "asc" }, { createdAt: "asc" }],
  })
  return rows.map((r) => ({
    id: r.id,
    factorType: r.factorType,
    queryGroupId: r.queryGroupId,
    createdAt: r.createdAt,
  }))
}

/** factorType × queryGroupId ペアを追加（重複は無視） */
export async function addFactorConfig(
  factorType: FactorType,
  queryGroupId: string,
): Promise<void> {
  await prisma.factorQueryConfig.upsert({
    where: { factorType_queryGroupId: { factorType, queryGroupId } },
    create: { factorType, queryGroupId },
    update: {},
  })
}

/** factorType × queryGroupId ペアを削除 */
export async function removeFactorConfig(
  factorType: FactorType,
  queryGroupId: string,
): Promise<void> {
  await prisma.factorQueryConfig.deleteMany({
    where: { factorType, queryGroupId },
  })
}

// ─── WeeklyFactorAnalysis ─────────────────────────────────────

/** 指定週の分析結果を取得 */
export async function getWeeklyFactorAnalyses(
  weekStart: Date,
): Promise<WeeklyFactorAnalysisDTO[]> {
  const rows = await prisma.weeklyFactorAnalysis.findMany({
    where: { weekStart },
    orderBy: { factorType: "asc" },
  })
  return rows.map(toDTO)
}

/** 週次 factor 分析を実行（週終了チェック → LLM 呼び出し → DB 保存） */
export async function runWeeklyFactorAnalysis(
  weekStart: Date,
): Promise<WeeklyFactorAnalysisDTO[]> {
  const configs = await prisma.factorQueryConfig.findMany()
  if (configs.length === 0) {
    throw new Error("分析に使用するフィルターが設定されていません。")
  }

  // FACTOR_ANALYSIS_REQUIRE_WEEK_END=false のとき flexible モード（要約が1件以上あれば実行可能）
  const requireWeekEnd = process.env.FACTOR_ANALYSIS_REQUIRE_WEEK_END !== "false"

  if (requireWeekEnd) {
    const weekEnd = getWeekEnd(weekStart)
    if (new Date() <= weekEnd) {
      throw new Error("週がまだ終了していません。分析は週終了後に実行できます。")
    }
  } else {
    const allQueryGroupIds = [...new Set(configs.map((c) => c.queryGroupId))]
    const summaryCount = await prisma.weeklyNewsSummary.count({
      where: { queryGroupId: { in: allQueryGroupIds }, weekStart },
    })
    if (summaryCount === 0) {
      throw new Error(
        "対象週のニュース要約が見つかりません。先にニュース要約を生成してください。",
      )
    }
  }

  // factorType ごとに queryGroupId をまとめる
  const byFactor = new Map<FactorType, string[]>()
  for (const c of configs) {
    if (!byFactor.has(c.factorType)) byFactor.set(c.factorType, [])
    byFactor.get(c.factorType)!.push(c.queryGroupId)
  }

  const weekLabel = formatWeekRange(weekStart)
  const results: WeeklyFactorAnalysisDTO[] = []

  for (const [factorType, queryGroupIds] of byFactor) {
    // factorType に紐づく queryGroupId の週次要約を取得
    const summaries = await prisma.weeklyNewsSummary.findMany({
      where: { queryGroupId: { in: queryGroupIds }, weekStart },
      select: { queryName: true, content: true, queryId: true },
    })

    if (summaries.length === 0) continue

    // 要約をそのまま分析入力として渡す（title=フィルター名、summary=要約本文）
    const summariesAsArticles = summaries.map((s) => ({
      title: s.queryName,
      summary: s.content,
      publishedAt: weekStart,
    }))

    const result = await generateFactorAnalysis(factorType, summariesAsArticles, weekLabel)

    const representativeQueryId = summaries[0].queryId

    const saved = await prisma.weeklyFactorAnalysis.upsert({
      where: { weekStart_factorType: { weekStart, factorType } },
      create: {
        weekStart,
        factorType,
        queryId: representativeQueryId,
        content: result.content,
        impact: result.impact as NewsImpact,
        generatedAt: new Date(),
      },
      update: {
        queryId: representativeQueryId,
        content: result.content,
        impact: result.impact as NewsImpact,
        generatedAt: new Date(),
      },
    })

    results.push(toDTO(saved))
  }

  return results
}

// ─── WeeklyNewsSummary ────────────────────────────────────────

export interface WeeklyNewsSummaryDTO {
  id: string
  weekStart: Date
  queryGroupId: string
  queryId: string
  queryName: string
  content: string
  articleCount: number
  generatedAt: Date
}

/** 指定週のニュース要約を取得（フィルター単位） */
export async function getWeeklyNewsSummaries(
  weekStart: Date,
): Promise<WeeklyNewsSummaryDTO[]> {
  const rows = await prisma.weeklyNewsSummary.findMany({
    where: { weekStart },
    orderBy: { generatedAt: "asc" },
  })
  return rows.map(toNewsSummaryDTO)
}

/** 週次ニュース要約を生成・保存（cron / 手動実行用） */
export async function generateWeeklyNewsSummaries(
  weekStart: Date,
): Promise<WeeklyNewsSummaryDTO[]> {
  const requireWeekEnd = process.env.FACTOR_ANALYSIS_REQUIRE_WEEK_END !== "false"

  if (requireWeekEnd) {
    const weekEnd = getWeekEnd(weekStart)
    if (new Date() <= weekEnd) {
      throw new Error("週がまだ終了していません。要約は週終了後に実行できます。")
    }
  }

  const queries = await listActiveQueries()
  if (queries.length === 0) {
    throw new Error("アクティブな検索フィルターがありません。")
  }

  const weekLabel = formatWeekRange(weekStart)
  const results: WeeklyNewsSummaryDTO[] = []

  for (const query of queries) {
    // 全世代クエリのIDを収集
    const allQueries = await prisma.newsQuery.findMany({
      where: { queryGroupId: query.queryGroupId },
      select: { id: true },
    })
    const queryIds = allQueries.map((q) => q.id)

    const articles = await prisma.businessNews.findMany({
      where: { queryId: { in: queryIds }, weekStart, deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 30,
      select: { title: true, summary: true, publishedAt: true },
    })

    if (articles.length === 0) continue

    const content = await generateNewsSummary(query.name, articles, weekLabel)

    // 最新アクティブクエリIDを代表として使用
    const activeQuery = await prisma.newsQuery.findFirst({
      where: { queryGroupId: query.queryGroupId, isActive: true },
      orderBy: { createdAt: "desc" },
    })
    const representativeQueryId = activeQuery?.id ?? queryIds[0]

    const saved = await prisma.weeklyNewsSummary.upsert({
      where: { weekStart_queryGroupId: { weekStart, queryGroupId: query.queryGroupId } },
      create: {
        weekStart,
        queryGroupId: query.queryGroupId,
        queryId: representativeQueryId,
        queryName: query.name,
        content,
        articleCount: articles.length,
        generatedAt: new Date(),
      },
      update: {
        queryId: representativeQueryId,
        queryName: query.name,
        content,
        articleCount: articles.length,
        generatedAt: new Date(),
      },
    })

    results.push(toNewsSummaryDTO(saved))
  }

  return results
}

function toNewsSummaryDTO(row: {
  id: string
  weekStart: Date
  queryGroupId: string
  queryId: string
  queryName: string
  content: string
  articleCount: number
  generatedAt: Date
}): WeeklyNewsSummaryDTO {
  return {
    id: row.id,
    weekStart: row.weekStart,
    queryGroupId: row.queryGroupId,
    queryId: row.queryId,
    queryName: row.queryName,
    content: row.content,
    articleCount: row.articleCount,
    generatedAt: row.generatedAt,
  }
}

// ─── WeeklyFactorAnalysis toDTO ───────────────────────────────

function toDTO(row: {
  id: string
  weekStart: Date
  factorType: FactorType
  queryId: string
  content: string
  impact: NewsImpact
  generatedAt: Date
}): WeeklyFactorAnalysisDTO {
  return {
    id: row.id,
    weekStart: row.weekStart,
    factorType: row.factorType,
    queryId: row.queryId,
    content: row.content,
    impact: row.impact,
    generatedAt: row.generatedAt,
  }
}
