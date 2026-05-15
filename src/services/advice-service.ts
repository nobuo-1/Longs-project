import { prisma } from "@/src/lib/prisma"
import { getWeekEnd, formatWeekRange } from "@/src/lib/news-week"
import { generateFactorAnalysis } from "@/src/lib/gemini"
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

  // FACTOR_ANALYSIS_REQUIRE_WEEK_END=false のとき flexible モード（5件以上のニュースがあれば実行可能）
  const requireWeekEnd = process.env.FACTOR_ANALYSIS_REQUIRE_WEEK_END !== "false"

  if (requireWeekEnd) {
    const weekEnd = getWeekEnd(weekStart)
    if (new Date() <= weekEnd) {
      throw new Error("週がまだ終了していません。分析は週終了後に実行できます。")
    }
  } else {
    const allQueryGroupIds = [...new Set(configs.map((c) => c.queryGroupId))]
    const allQueries = await prisma.newsQuery.findMany({
      where: { queryGroupId: { in: allQueryGroupIds } },
      select: { id: true },
    })
    const articleCount = await prisma.businessNews.count({
      where: { queryId: { in: allQueries.map((q) => q.id) }, weekStart, deletedAt: null },
    })
    if (articleCount < 5) {
      throw new Error(
        `分析を実行するには5件以上のニュースが必要です（現在${articleCount}件）。`,
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
    // 全世代クエリ ID を収集
    const allQueries = await prisma.newsQuery.findMany({
      where: { queryGroupId: { in: queryGroupIds } },
      select: { id: true },
    })
    const queryIds = allQueries.map((q) => q.id)
    if (queryIds.length === 0) continue

    // その週のニュース記事を取得（最大 30 件）
    const articles = await prisma.businessNews.findMany({
      where: { queryId: { in: queryIds }, weekStart, deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 30,
      select: { title: true, summary: true, publishedAt: true },
    })

    const result = await generateFactorAnalysis(factorType, articles, weekLabel)

    // 代表 queryId（最新アクティブクエリ、なければ最初の ID）
    const activeQuery = await prisma.newsQuery.findFirst({
      where: { queryGroupId: { in: queryGroupIds }, isActive: true },
      orderBy: { createdAt: "desc" },
    })
    const representativeQueryId = activeQuery?.id ?? queryIds[0]

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
