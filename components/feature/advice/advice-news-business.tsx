"use client"

import { useState, useTransition, useCallback } from "react"
import { Globe, Plus, Pencil, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/feature/page-header"
import { WeekPicker } from "@/components/feature/advice/week-picker"
import { NewsQueryEditDialog } from "@/components/feature/advice/news-query-edit-dialog"
import { cn } from "@/lib/utils"
import { getWeekStart } from "@/src/lib/news-week"
import {
  fetchLatestNewsAction,
  getNewsViewAction,
  listActiveQueriesAction,
  createNewsQueryAction,
  updateNewsQueryAction,
  deleteNewsQueryAction,
} from "@/src/actions/news-actions"
import type { NewsQueryDTO, NewsViewGroup } from "@/src/actions/news-actions"

interface Props {
  initialData: NewsViewGroup[]
  initialWeekStart: Date
  initialQueries: NewsQueryDTO[]
}

export function BusinessNewsClient({ initialData, initialWeekStart, initialQueries }: Props) {
  const [weekStart, setWeekStart] = useState<Date>(initialWeekStart)
  const [viewData, setViewData] = useState<NewsViewGroup[]>(initialData)
  const [queries, setQueries] = useState<NewsQueryDTO[]>(initialQueries)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuery, setEditingQuery] = useState<NewsQueryDTO | null>(null)
  const [isFetching, startFetching] = useTransition()
  const [isLoading, startLoading] = useTransition()

  // ─── ニュース表示データ取得 ──────────────────────────────────────

  const loadNewsView = useCallback(
    (ws: Date) => {
      startLoading(async () => {
        const res = await getNewsViewAction(ws.toISOString())
        if (res.success) setViewData(res.data)
      })
    },
    [],
  )

  // ─── 週切替 ───────────────────────────────────────────────────────

  function handleWeekChange(ws: Date) {
    setWeekStart(ws)
    loadNewsView(ws)
  }

  // ─── 最新ニュース取得 ─────────────────────────────────────────────

  function handleFetch() {
    startFetching(async () => {
      await fetchLatestNewsAction()
      // 取得後にクエリ一覧と表示データを更新
      const [qRes, nRes] = await Promise.all([
        listActiveQueriesAction(),
        getNewsViewAction(weekStart.toISOString()),
      ])
      if (qRes.success) setQueries(qRes.data)
      if (nRes.success) setViewData(nRes.data)
    })
  }

  // ─── クエリ編集ダイアログ ─────────────────────────────────────────

  function openCreate() {
    setEditingQuery(null)
    setDialogOpen(true)
  }

  function openEdit(q: NewsQueryDTO) {
    setEditingQuery(q)
    setDialogOpen(true)
  }

  async function handleSave(input: Parameters<typeof createNewsQueryAction>[0]) {
    if (editingQuery) {
      const res = await updateNewsQueryAction(editingQuery.id, input)
      if (!res.success) throw new Error(res.error)
    } else {
      const res = await createNewsQueryAction(input)
      if (!res.success) throw new Error(res.error)
    }
    // クエリ一覧と表示データを更新
    const [qRes, nRes] = await Promise.all([
      listActiveQueriesAction(),
      getNewsViewAction(weekStart.toISOString()),
    ])
    if (qRes.success) setQueries(qRes.data)
    if (nRes.success) setViewData(nRes.data)
  }

  async function handleDelete() {
    if (!editingQuery) return
    const res = await deleteNewsQueryAction(editingQuery.id)
    if (!res.success) throw new Error(res.error)
    const [qRes, nRes] = await Promise.all([
      listActiveQueriesAction(),
      getNewsViewAction(weekStart.toISOString()),
    ])
    if (qRes.success) setQueries(qRes.data)
    if (nRes.success) setViewData(nRes.data)
  }

  // ─── レンダリング ─────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        eyebrow="AI Advice"
        title="経営判断に直結するニュース"
        description="為替、原材料、物流、競合の変化を一覧で確認し、経営判断に必要な外部環境を把握します。"
        icon={Globe}
      />

      {/* ツールバー */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeekPicker weekStart={weekStart} onChange={handleWeekChange} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFetch}
            disabled={isFetching || queries.length === 0}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1.5", isFetching && "animate-spin")} />
            {isFetching ? "取得中..." : "最新ニュースを取得"}
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            検索フィルターを追加
          </Button>
        </div>
      </div>

      {/* フィルターが0件 */}
      {queries.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="mb-3">検索フィルターがまだ登録されていません。</p>
            <Button variant="outline" size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1.5" />
              検索フィルターを追加
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ニュースカード（queryGroupId単位） */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">読み込み中...</div>
      ) : (
        viewData.map((group) => (
          <Card key={group.queryGroupId}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{group.queryName}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {group.articles.length} 件
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      const q = queries.find(
                        (q) => q.queryGroupId === group.queryGroupId,
                      )
                      if (q) openEdit(q)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.articles.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  この週のニュースはありません。「最新ニュースを取得」ボタンで取得できます。
                </p>
              ) : (
                group.articles.map((article) => (
                  <div
                    key={article.id}
                    className="p-3 rounded-xl border border-border/70 hover:border-[#345fe1]/60 hover:shadow-sm transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <Badge
                        className={cn(
                          "text-xs",
                          article.impact === "high"
                            ? "bg-red-100 text-red-700"
                            : article.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : article.impact === "low"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500",
                        )}
                      >
                        影響度:{" "}
                        {article.impact === "high"
                          ? "高"
                          : article.impact === "medium"
                            ? "中"
                            : article.impact === "low"
                              ? "低"
                              : "-"}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {article.sourceName && `${article.sourceName} ・ `}
                        {new Date(article.publishedAt).toLocaleString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {article.sourceUrl ? (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <p className="font-semibold">{article.title}</p>
                    )}
                    {article.summary && (
                      <p className="text-sm text-muted-foreground mt-1">{article.summary}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* 編集ダイアログ: key で editingQuery が変わるたびに state をリセット */}
      <NewsQueryEditDialog
        key={editingQuery?.id ?? "new"}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        query={editingQuery}
        onSave={handleSave}
        onDelete={editingQuery ? handleDelete : undefined}
      />
    </div>
  )
}
