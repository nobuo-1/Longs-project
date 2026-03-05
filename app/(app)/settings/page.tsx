"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Settings2, Wallet, Plus, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/src/actions/settings-actions"
import type { CategoryDTO } from "@/src/actions/settings-actions"

// ── 固定費・内部留保はローカル状態のまま ──────────────────────────────────

const fixedCostDefaults = [
  { id: "rent", name: "家賃", amount: 980000, day: 25 },
  { id: "payroll", name: "人件費", amount: 4200000, day: 25 },
  { id: "logistics", name: "物流費", amount: 620000, day: 20 },
  { id: "saas", name: "SaaS / システム", amount: 180000, day: 15 },
]

const reserveDefaults = [
  { id: "emergency", name: "緊急準備金", description: "不測の事態への備え", percent: 10 },
  { id: "seasonal", name: "季節仕入れ", description: "シーズン商品の仕入れ資金", percent: 15 },
  { id: "equipment", name: "設備更新", description: "店舗設備の更新・修繕", percent: 5 },
  { id: "expansion", name: "事業拡大", description: "新店舗・新事業への投資", percent: 10 },
]

// ── カテゴリ編集用の行型（新規追加行は id が未定） ────────────────────────
type DraftRow = { key: string; id?: string; name: string; sellThroughDays: number }

export default function SettingsPage() {
  // ── カテゴリ状態 ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [isCategoryEditing, setIsCategoryEditing] = useState(false)
  const [draft, setDraft] = useState<DraftRow[]>([])
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  const [deleteErrors, setDeleteErrors] = useState<Record<string, string>>({})

  // ── 固定費・内部留保状態 ──────────────────────────────────────────────────
  const [fixedCosts, setFixedCosts] = useState(fixedCostDefaults)
  const [fixedCostsDraft, setFixedCostsDraft] = useState(fixedCostDefaults)
  const [isFixedEditing, setIsFixedEditing] = useState(false)
  const [reserveSettings, setReserveSettings] = useState(reserveDefaults)
  const [reserveDraft, setReserveDraft] = useState(reserveDefaults)
  const [isReserveEditing, setIsReserveEditing] = useState(false)

  // ── カテゴリ取得 ──────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true)
    setCategoryError(null)
    const res = await getCategoriesAction()
    if (res.success) {
      setCategories(res.data)
    } else {
      setCategoryError(res.error)
    }
    setCategoryLoading(false)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // ── カテゴリ編集開始 ──────────────────────────────────────────────────────
  const handleCategoryEdit = () => {
    setDraft(
      categories.map((c) => ({ key: c.id, id: c.id, name: c.name, sellThroughDays: c.sellThroughDays })),
    )
    setDeleteErrors({})
    setIsCategoryEditing(true)
  }

  const handleCategoryCancel = () => {
    setIsCategoryEditing(false)
    setDraft([])
    setDeleteErrors({})
  }

  // ── カテゴリ保存 ──────────────────────────────────────────────────────────
  const handleCategorySave = async () => {
    const errors: string[] = []
    const updated: CategoryDTO[] = []

    for (const row of draft) {
      if (row.id) {
        // 既存カテゴリ: 変更があれば更新
        const original = categories.find((c) => c.id === row.id)
        if (original && original.name === row.name && original.sellThroughDays === row.sellThroughDays) {
          updated.push(original)
          continue
        }
        setSavingIds((s) => new Set(s).add(row.key))
        const res = await updateCategoryAction(row.id, row.name, row.sellThroughDays)
        setSavingIds((s) => { const n = new Set(s); n.delete(row.key); return n })
        if (res.success) {
          updated.push(res.data)
        } else {
          errors.push(`「${row.name}」: ${res.error}`)
          updated.push(original ?? { id: row.id, name: row.name, sellThroughDays: row.sellThroughDays })
        }
      } else {
        // 新規カテゴリ
        setSavingIds((s) => new Set(s).add(row.key))
        const res = await createCategoryAction(row.name, row.sellThroughDays)
        setSavingIds((s) => { const n = new Set(s); n.delete(row.key); return n })
        if (res.success) {
          updated.push(res.data)
        } else {
          errors.push(`「${row.name}」: ${res.error}`)
        }
      }
    }

    setCategories(updated)

    if (errors.length > 0) {
      setCategoryError(errors.join("\n"))
    } else {
      setCategoryError(null)
      setIsCategoryEditing(false)
      setDraft([])
    }
  }

  // ── カテゴリ追加（ドラフト行） ────────────────────────────────────────────
  const handleAddDraftRow = () => {
    setDraft((prev) => [
      ...prev,
      { key: `new-${Date.now()}`, name: "", sellThroughDays: 60 },
    ])
  }

  // ── カテゴリ削除 ──────────────────────────────────────────────────────────
  const handleDeleteCategory = async (row: DraftRow) => {
    if (!row.id) {
      // まだ保存されていない新規行はドラフトから除くだけ
      setDraft((prev) => prev.filter((r) => r.key !== row.key))
      return
    }
    setSavingIds((s) => new Set(s).add(row.key))
    const res = await deleteCategoryAction(row.id)
    setSavingIds((s) => { const n = new Set(s); n.delete(row.key); return n })
    if (res.success) {
      setDraft((prev) => prev.filter((r) => r.key !== row.key))
      setCategories((prev) => prev.filter((c) => c.id !== row.id))
      setDeleteErrors((prev) => { const n = { ...prev }; delete n[row.key]; return n })
    } else {
      setDeleteErrors((prev) => ({ ...prev, [row.key]: res.error ?? "削除に失敗しました" }))
    }
  }

  // ── 固定費ハンドラ ────────────────────────────────────────────────────────
  const handleFixedEdit = () => { setFixedCostsDraft(fixedCosts.map((i) => ({ ...i }))); setIsFixedEditing(true) }
  const handleFixedSave = () => { setFixedCosts(fixedCostsDraft.map((i) => ({ ...i }))); setIsFixedEditing(false) }
  const handleFixedCancel = () => { setFixedCostsDraft(fixedCosts.map((i) => ({ ...i }))); setIsFixedEditing(false) }
  const handleAddFixedCost = () => {
    setFixedCostsDraft((prev) => [...prev, { id: `new-${Date.now()}`, name: "新規項目", amount: 0, day: 25 }])
  }

  // ── 内部留保ハンドラ ──────────────────────────────────────────────────────
  const handleReserveEdit = () => { setReserveDraft(reserveSettings.map((i) => ({ ...i }))); setIsReserveEditing(true) }
  const handleReserveSave = () => { setReserveSettings(reserveDraft.map((i) => ({ ...i }))); setIsReserveEditing(false) }
  const handleReserveCancel = () => { setReserveDraft(reserveSettings.map((i) => ({ ...i }))); setIsReserveEditing(false) }

  const reserveView = isReserveEditing ? reserveDraft : reserveSettings
  const reserveTotal = reserveView.reduce((sum, item) => sum + item.percent, 0)

  const displayRows = isCategoryEditing ? draft : categories.map((c) => ({ key: c.id, id: c.id, name: c.name, sellThroughDays: c.sellThroughDays }))

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Settings</p>
            <h1 className="text-2xl font-bold text-foreground">システム設定</h1>
            <p className="text-muted-foreground">カテゴリ別の売り切り期限など、基本設定を管理します。</p>
          </div>
        </div>

        {/* ── カテゴリ別 売り切り期限設定 ── */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#345fe1]" />
                カテゴリ別 売り切り期限設定
              </CardTitle>
              <div className="flex items-center gap-2">
                {isCategoryEditing && (
                  <Button variant="outline" size="sm" onClick={handleAddDraftRow}>
                    <Plus className="w-4 h-4 mr-1" />
                    カテゴリを追加
                  </Button>
                )}
                {isCategoryEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCategoryCancel}>
                      キャンセル
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white"
                      onClick={handleCategorySave}
                      disabled={savingIds.size > 0}
                    >
                      {savingIds.size > 0 && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      保存
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleCategoryEdit} disabled={categoryLoading}>
                    編集
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {categoryLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">読み込み中...</span>
              </div>
            ) : (
              <>
                {categoryError && (
                  <p className="text-xs text-red-500 mb-3 whitespace-pre-line">{categoryError}</p>
                )}
                {displayRows.length === 0 && !isCategoryEditing && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    カテゴリがありません。「編集」→「カテゴリを追加」から追加してください。
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displayRows.map((row) => (
                    <div key={row.key} className="p-3 border border-border rounded-lg space-y-2">
                      {isCategoryEditing ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="カテゴリ名"
                              value={row.name}
                              onChange={(e) =>
                                setDraft((prev) =>
                                  prev.map((r) => (r.key === row.key ? { ...r, name: e.target.value } : r)),
                                )
                              }
                              className="flex-1 text-sm font-semibold"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={savingIds.has(row.key)}
                              onClick={() => handleDeleteCategory(row)}
                            >
                              {savingIds.has(row.key) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </Button>
                          </div>
                          {deleteErrors[row.key] && (
                            <p className="text-xs text-red-500">{deleteErrors[row.key]}</p>
                          )}
                          <Input
                            type="number"
                            min={1}
                            value={row.sellThroughDays}
                            onChange={(e) =>
                              setDraft((prev) =>
                                prev.map((r) =>
                                  r.key === row.key ? { ...r, sellThroughDays: Number(e.target.value) } : r,
                                ),
                              )
                            }
                          />
                          <p className="text-xs text-muted-foreground">売り切り目標日数</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold">{row.name}</p>
                          <p className="text-lg font-bold text-foreground">{row.sellThroughDays} 日</p>
                          <p className="text-xs text-muted-foreground">売り切り目標日数</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── 固定費の設定 ── */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#345fe1]" />
                固定費の設定
              </CardTitle>
              <div className="flex items-center gap-2">
                {isFixedEditing && (
                  <Button variant="outline" size="sm" onClick={handleAddFixedCost}>
                    <Plus className="w-4 h-4 mr-1" />
                    項目追加
                  </Button>
                )}
                {isFixedEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleFixedCancel}>
                      キャンセル
                    </Button>
                    <Button size="sm" className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" onClick={handleFixedSave}>
                      保存
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleFixedEdit}>
                    編集
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(isFixedEditing ? fixedCostsDraft : fixedCosts).map((item, index) => (
              <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {isFixedEditing ? (
                    <Input
                      value={fixedCostsDraft[index].name}
                      onChange={(e) =>
                        setFixedCostsDraft((prev) =>
                          prev.map((cost, idx) => (idx === index ? { ...cost, name: e.target.value } : cost)),
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold">{item.name}</p>
                  )}
                  {isFixedEditing && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setFixedCostsDraft((prev) => prev.filter((cost) => cost.id !== item.id))
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">月額</p>
                    {isFixedEditing ? (
                      <Input
                        type="number"
                        value={fixedCostsDraft[index].amount}
                        onChange={(e) =>
                          setFixedCostsDraft((prev) =>
                            prev.map((cost, idx) =>
                              idx === index ? { ...cost, amount: Number(e.target.value) } : cost,
                            ),
                          )
                        }
                      />
                    ) : (
                      <p className="text-lg font-bold text-foreground">
                        {new Intl.NumberFormat("ja-JP").format(item.amount)} 円
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">支払日</p>
                    {isFixedEditing ? (
                      <Input
                        type="number"
                        value={fixedCostsDraft[index].day}
                        onChange={(e) =>
                          setFixedCostsDraft((prev) =>
                            prev.map((cost, idx) => (idx === index ? { ...cost, day: Number(e.target.value) } : cost)),
                          )
                        }
                      />
                    ) : (
                      <p className="text-lg font-bold text-foreground">{item.day} 日</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── 内部留保の設定 ── */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#345fe1]" />
                内部留保の設定
              </CardTitle>
              <div className="flex items-center gap-2">
                {isReserveEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleReserveCancel}>
                      キャンセル
                    </Button>
                    <Button size="sm" className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" onClick={handleReserveSave}>
                      保存
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleReserveEdit}>
                    編集
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reserveView.map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    {isReserveEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={40}
                          value={reserveDraft[index].percent}
                          onChange={(e) =>
                            setReserveDraft((prev) =>
                              prev.map((row, idx) =>
                                idx === index ? { ...row, percent: Number(e.target.value) } : row,
                              ),
                            )
                          }
                          className="w-20 text-right"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-foreground">{item.percent}%</p>
                    )}
                  </div>
                  {isReserveEditing && (
                    <Slider
                      value={[reserveDraft[index].percent]}
                      onValueChange={(value: number[]) =>
                        setReserveDraft((prev) =>
                          prev.map((row, idx) => (idx === index ? { ...row, percent: value[0] } : row)),
                        )
                      }
                      max={40}
                      step={1}
                      className="[&_[data-slot=slider-track]]:bg-[#345fe1]/15 [&_[data-slot=slider-range]]:bg-[#345fe1] [&_[data-slot=slider-thumb]]:border-[#345fe1] [&_[data-slot=slider-thumb]]:focus-visible:ring-[#345fe1]/30 [&_[data-slot=slider-thumb]]:hover:ring-[#345fe1]/20"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/30 p-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">内部留保合計</p>
                <p className="text-lg font-bold text-foreground">{reserveTotal}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">可処分予算目安</p>
                <p className="text-lg font-bold text-[#345fe1]">{Math.max(0, 100 - reserveTotal)}%</p>
              </div>
              {reserveTotal > 100 && (
                <p className="text-xs text-red-500">合計が100%を超えています。</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
