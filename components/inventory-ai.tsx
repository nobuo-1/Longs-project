"use client"

import { useState, useMemo, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import {
  getInventoryCatalogAction,
  getProcurementListAction,
  addProcurementItemAction,
  type CatalogVariantRow,
} from "@/src/actions/inventory-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface InventoryAIProps {
  initialTab?: "recommendations" | "table" | "catalog"
}

export function InventoryAI({ initialTab = "recommendations" }: InventoryAIProps) {
  const [recommendationPage, setRecommendationPage] = useState(1)
  const [catalogSearch, setCatalogSearch] = useState("")
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("all")
  const [catalogBrandFilter, setCatalogBrandFilter] = useState("all")
  const [catalogSeasonFilter, setCatalogSeasonFilter] = useState("all")
  const [catalogPage, setCatalogPage] = useState(1)

  // DB データ
  const [variantCatalog, setVariantCatalog] = useState<CatalogVariantRow[]>([])
  const [variantLoading, setVariantLoading] = useState(false)
  const [addedVariantIds, setAddedVariantIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (initialTab !== "catalog" && initialTab !== "recommendations") return
    setVariantLoading(true)
    getInventoryCatalogAction()
      .then((rows) => setVariantCatalog(rows))
      .catch(console.error)
      .finally(() => setVariantLoading(false))

    if (initialTab === "recommendations") {
      getProcurementListAction().then((result) => {
        if (!("error" in result)) {
          setAddedVariantIds(new Set(result.items.map((i) => i.variantId)))
        }
      })
    }
  }, [initialTab])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // 高需要アイテム（estimatedStock < 50）
  const recommendationItems = useMemo(
    () =>
      variantCatalog
        .filter((v) => v.estimatedStock < 50)
        .sort((a, b) => a.estimatedStock - b.estimatedStock),
    [variantCatalog],
  )

  const recommendationsPerPage = 8
  const recommendationTotalPages = Math.max(1, Math.ceil(recommendationItems.length / recommendationsPerPage))
  const currentRecommendationPage = Math.min(recommendationPage, recommendationTotalPages)
  const recommendationStart = (currentRecommendationPage - 1) * recommendationsPerPage
  const recommendationEnd = recommendationStart + recommendationsPerPage
  const pagedRecommendations = recommendationItems.slice(recommendationStart, recommendationEnd)
  const recommendationCount = recommendationItems.length
  const recommendationRangeStart = recommendationCount === 0 ? 0 : recommendationStart + 1
  const recommendationRangeEnd = Math.min(recommendationEnd, recommendationCount)

  const handleAddToProcurement = async (variant: CatalogVariantRow) => {
    const result = await addProcurementItemAction(variant.variantId, null, variant.priceYen, "high")
    if (!("error" in result)) {
      setAddedVariantIds((prev) => new Set([...prev, variant.variantId]))
    }
  }

  // カタログタブ用フィルタリング
  const variantCategories = useMemo(
    () => Array.from(new Set(variantCatalog.map((v) => v.categoryName).filter(Boolean) as string[])),
    [variantCatalog],
  )
  const variantBrands = useMemo(
    () => Array.from(new Set(variantCatalog.map((v) => v.brandName).filter(Boolean) as string[])),
    [variantCatalog],
  )
  const variantSeasons = useMemo(
    () => Array.from(new Set(variantCatalog.map((v) => v.season).filter(Boolean) as string[])),
    [variantCatalog],
  )

  const filteredVariants = useMemo(() => {
    const q = catalogSearch.toLowerCase()
    return variantCatalog.filter((v) => {
      const matchesSearch =
        q === "" ||
        (v.productName ?? "").toLowerCase().includes(q) ||
        (v.janCode ?? "").toLowerCase().includes(q) ||
        (v.brandName ?? "").toLowerCase().includes(q) ||
        (v.categoryName ?? "").toLowerCase().includes(q) ||
        (v.color ?? "").toLowerCase().includes(q) ||
        (v.size ?? "").toLowerCase().includes(q)
      const matchesCategory = catalogCategoryFilter === "all" || v.categoryName === catalogCategoryFilter
      const matchesBrand = catalogBrandFilter === "all" || v.brandName === catalogBrandFilter
      const matchesSeason = catalogSeasonFilter === "all" || v.season === catalogSeasonFilter
      return matchesSearch && matchesCategory && matchesBrand && matchesSeason
    })
  }, [variantCatalog, catalogSearch, catalogCategoryFilter, catalogBrandFilter, catalogSeasonFilter])

  const catalogItemsPerPage = 20
  const catalogTotalPages = Math.max(1, Math.ceil(filteredVariants.length / catalogItemsPerPage))
  const currentCatalogPage = Math.min(catalogPage, catalogTotalPages)
  const catalogStart = (currentCatalogPage - 1) * catalogItemsPerPage
  const catalogEnd = catalogStart + catalogItemsPerPage
  const pagedVariants = filteredVariants.slice(catalogStart, catalogEnd)
  const catalogRangeStart = filteredVariants.length === 0 ? 0 : catalogStart + 1
  const catalogRangeEnd = Math.min(catalogEnd, filteredVariants.length)

  const renderVariantEditDialog = (variant: CatalogVariantRow, trigger: React.ReactNode) => (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>バリアント詳細</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-muted-foreground">JAN</p>
            <p>{variant.janCode ?? "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-muted-foreground">商品名</p>
            <p>{variant.productName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-muted-foreground">カラー</p>
            <p>{variant.color ?? "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-muted-foreground">サイズ</p>
            <p>{variant.size ?? "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-muted-foreground">価格</p>
            <p>{variant.priceYen != null ? formatCurrency(variant.priceYen) : "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-muted-foreground">推定在庫</p>
            <p>{variant.estimatedStock}</p>
          </div>
        </div>
        <Button className="w-full mt-4 bg-[#345fe1] hover:bg-[#2a4bb3] text-white">保存（ダミー）</Button>
      </DialogContent>
    </Dialog>
  )

  const renderCatalog = () => (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">商品一覧</CardTitle>
            <p className="text-xs text-muted-foreground">SKU（商品×カラー×サイズ）粒度で在庫を管理できます。</p>
          </div>
          <Badge variant="outline" className="bg-muted/40">
            {variantLoading ? "読み込み中..." : `${filteredVariants.length} 件`}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-55">
            <Input
              placeholder="商品名 / JAN / ブランド / カテゴリ / カラー / サイズ"
              value={catalogSearch}
              onChange={(e) => {
                setCatalogSearch(e.target.value)
                setCatalogPage(1)
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <Select
              value={catalogCategoryFilter}
              onValueChange={(value: string) => {
                setCatalogCategoryFilter(value)
                setCatalogPage(1)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">全カテゴリ</SelectItem>
                {variantCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={catalogBrandFilter}
              onValueChange={(value: string) => {
                setCatalogBrandFilter(value)
                setCatalogPage(1)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ブランド" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">全ブランド</SelectItem>
                {variantBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={catalogSeasonFilter}
              onValueChange={(value: string) => {
                setCatalogSeasonFilter(value)
                setCatalogPage(1)
              }}
            >
              <SelectTrigger className="w-35">
                <SelectValue placeholder="シーズン" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">ALL</SelectItem>
                {variantSeasons.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">JAN</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">商品名</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">カラー</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">サイズ</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ブランド</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">カテゴリ</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">シーズン</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">価格</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">推定在庫</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">状態</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">推奨発注</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">編集</th>
              </tr>
            </thead>
            <tbody>
              {variantLoading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    読み込み中...
                  </td>
                </tr>
              ) : pagedVariants.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    条件に一致する商品がありません。
                  </td>
                </tr>
              ) : (
                pagedVariants.map((variant) => (
                  <tr key={variant.variantId} className="border-t border-border/70">
                    <td className="px-3 py-2 text-xs text-muted-foreground">{variant.janCode ?? "-"}</td>
                    <td className="px-3 py-2">{variant.productName}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{variant.color ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{variant.size ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{variant.brandName ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{variant.categoryName ?? "-"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{variant.season ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      {variant.priceYen != null ? formatCurrency(variant.priceYen) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right">{variant.estimatedStock}</td>
                    <td className="px-3 py-2">
                      <Badge className="text-[11px] bg-gray-100 text-gray-700">通常</Badge>
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-muted-foreground">-</td>
                    <td className="px-3 py-2 text-right">
                      {renderVariantEditDialog(
                        variant,
                        <Button size="sm" variant="outline">
                          編集
                        </Button>,
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {filteredVariants.length === 0
              ? "0 件"
              : `${catalogRangeStart}-${catalogRangeEnd} 件 / ${filteredVariants.length} 件`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCatalogPage((prev) => Math.max(1, prev - 1))}
              disabled={currentCatalogPage === 1}
            >
              前へ
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentCatalogPage} / {catalogTotalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCatalogPage((prev) => Math.min(catalogTotalPages, prev + 1))}
              disabled={currentCatalogPage === catalogTotalPages}
            >
              次へ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Inventory AI</p>
        <h2 className="text-2xl font-bold text-foreground">{initialTab === "catalog" ? "商品一覧" : "仕入れ提案"}</h2>
        <p className="text-muted-foreground">
          {initialTab === "catalog" ? "商品DBからの参照" : "過去データに基づく最適在庫提案"}
        </p>
      </div>

      {initialTab === "catalog" ? (
        renderCatalog()
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">仕入れ提案</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-muted/40">
                    提案 {variantLoading ? "..." : recommendationCount} 件
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                推定在庫が50点未満の商品を高需要として抽出しています。
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">JAN</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">商品</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">カテゴリ</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">推定在庫</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">価格</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">推奨発注</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">ステータス</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantLoading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          読み込み中...
                        </td>
                      </tr>
                    ) : pagedRecommendations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          現在、提案対象の在庫はありません。
                        </td>
                      </tr>
                    ) : (
                      pagedRecommendations.map((variant) => {
                        const isAdded = addedVariantIds.has(variant.variantId)
                        return (
                          <tr key={variant.variantId} className="border-t border-border/70 hover:bg-muted/40">
                            <td className="px-4 py-3 text-xs text-muted-foreground">{variant.janCode ?? "-"}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground">{variant.productName}</p>
                              <p className="text-xs text-muted-foreground">
                                {[variant.color, variant.size].filter(Boolean).join(" / ")}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{variant.categoryName ?? "-"}</td>
                            <td className="px-4 py-3 text-right font-medium">{variant.estimatedStock}点</td>
                            <td className="px-4 py-3 text-right">
                              {variant.priceYen != null ? formatCurrency(variant.priceYen) : "-"}
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-muted-foreground">-</td>
                            <td className="px-4 py-3 text-center">
                              <Badge className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-100">
                                <TrendingUp className="w-3 h-3 mr-1 text-[#345fe1]" />
                                高需要
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant={isAdded ? "outline" : "default"}
                                onClick={() => handleAddToProcurement(variant)}
                                disabled={isAdded}
                                className={cn(
                                  isAdded
                                    ? "text-[#345fe1] border-[#345fe1] bg-transparent"
                                    : "bg-[#345fe1] hover:bg-[#2a4bb3] text-white",
                                )}
                              >
                                {isAdded ? "追加済み" : "発注に追加"}
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {recommendationCount === 0
                    ? "0 件"
                    : `${recommendationRangeStart}-${recommendationRangeEnd} 件 / ${recommendationCount} 件`}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRecommendationPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentRecommendationPage === 1}
                  >
                    前へ
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentRecommendationPage} / {recommendationTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRecommendationPage((prev) => Math.min(recommendationTotalPages, prev + 1))}
                    disabled={currentRecommendationPage === recommendationTotalPages}
                  >
                    次へ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
