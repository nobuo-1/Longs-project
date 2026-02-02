"use client"
 
import { useState, useMemo } from "react"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useProcurementList } from "@/hooks/use-procurement-list"

interface InventoryAIProps {
  initialTab?: "recommendations" | "table" | "catalog"
}

type CatalogItem = {
  id: string
  name: string
  category: string
  brand: string
  season: string
  manufacturer: string
  price: number
  currentStock: number
  suggestedOrder: number
  status: "high" | "overstock" | "normal"
  colors: string[]
  sizes: string[]
}

const productCatalog: CatalogItem[] = [
  {
    id: "SKU001",
    name: "春物ジャケット（ネイビー）",
    category: "アウター",
    brand: "Healthknit",
    season: "SS",
    manufacturer: "TOKYO BRAND",
    price: 15800,
    currentStock: 12,
    suggestedOrder: 30,
    status: "high" as const,
    colors: ["ネイビー", "グレー", "ベージュ"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "SKU002",
    name: "コットンTシャツ（白）",
    category: "ﾄｯﾌﾟｽ",
    brand: "FILA",
    season: "ALL",
    manufacturer: "BASIC WEAR",
    price: 3980,
    currentStock: 45,
    suggestedOrder: 60,
    status: "high" as const,
    colors: ["白", "黒", "グレー", "ネイビー"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "SKU003",
    name: "デニムパンツ（ブルー）",
    category: "ﾎﾞﾄﾑ",
    brand: "Healthknit",
    season: "ALL",
    manufacturer: "DENIM CO",
    price: 8900,
    currentStock: 35,
    suggestedOrder: 25,
    status: "overstock" as const,
    colors: ["ライトブルー", "インディゴ", "ブラック"],
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "SKU004",
    name: "リネンシャツ（ベージュ）",
    category: "ｼｬﾂ",
    brand: "Healthknit",
    season: "SS",
    manufacturer: "SUMMER LINE",
    price: 6800,
    currentStock: 8,
    suggestedOrder: 40,
    status: "high" as const,
    colors: ["ベージュ", "白", "ライトブルー"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "SKU005",
    name: "ウールコート（グレー）",
    category: "ｱｳﾀｰ",
    brand: "その他",
    season: "AW",
    manufacturer: "WINTER STYLE",
    price: 29800,
    currentStock: 28,
    suggestedOrder: 10,
    status: "overstock" as const,
    colors: ["グレー", "ネイビー", "キャメル"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "SKU006",
    name: "スニーカー（白）",
    category: "ｿｯｸｽ",
    brand: "Reebok",
    season: "ALL",
    manufacturer: "STEP FORWARD",
    price: 12800,
    currentStock: 22,
    suggestedOrder: 35,
    status: "high" as const,
    colors: ["白", "黒", "グレー"],
    sizes: ["23", "24", "25", "26", "27", "28"],
  },
  {
    id: "SKU007",
    name: "レザーベルト（茶）",
    category: "小物",
    brand: "ｱｺﾓﾃﾞ",
    season: "ALL",
    manufacturer: "CLASSIC LEATHER",
    price: 4500,
    currentStock: 55,
    suggestedOrder: 20,
    status: "normal" as const,
    colors: ["ブラウン", "ブラック"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "SKU008",
    name: "カシミアニット（グレー）",
    category: "ﾄｯﾌﾟｽ",
    brand: "Healthknit",
    season: "AW",
    manufacturer: "LUXURY KNIT",
    price: 18500,
    currentStock: 15,
    suggestedOrder: 25,
    status: "high" as const,
    colors: ["グレー", "ネイビー", "ベージュ", "ブラック"],
    sizes: ["S", "M", "L", "XL"],
  },
]

export function InventoryAI({ initialTab = "recommendations" }: InventoryAIProps) {
  const [catalogItems, setCatalogItems] = useState(productCatalog)
  const [recommendationPage, setRecommendationPage] = useState(1)
  const [catalogSearch, setCatalogSearch] = useState("")
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("all")
  const [catalogBrandFilter, setCatalogBrandFilter] = useState("all")
  const [catalogSeasonFilter, setCatalogSeasonFilter] = useState("all")
  const [catalogStatusFilter, setCatalogStatusFilter] = useState("all")
  const [catalogPage, setCatalogPage] = useState(1)
  const { items: procurementItems, addItem, isItemAdded } = useProcurementList()

  const filteredProducts = useMemo(() => catalogItems, [catalogItems])

  const catalogCategories = useMemo(
    () => Array.from(new Set(catalogItems.map((item) => item.category))),
    [catalogItems],
  )
  const catalogBrands = useMemo(
    () => Array.from(new Set(catalogItems.map((item) => item.brand || "その他"))),
    [catalogItems],
  )

  const updateCatalogItem = (id: string, updates: Partial<(typeof catalogItems)[number]>) => {
    setCatalogItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const calcRotation = (item: CatalogItem) => {
    if (!item.currentStock) return 0
    return item.suggestedOrder / item.currentStock
  }

  const formatRotation = (value: number) => value.toFixed(1)

  const handleAddToProcurement = (item: CatalogItem) => {
    addItem({
      id: item.id,
      name: item.name,
      category: item.category,
      manufacturer: item.manufacturer,
      currentStock: item.currentStock,
      suggestedOrder: item.suggestedOrder,
      status: item.status,
      price: item.price,
    })
  }

  const recommendationItems = useMemo(() => filteredProducts.filter((product) => product.status === "high"), [
    filteredProducts,
  ])
  const recommendationsPerPage = 8
  const recommendationTotalPages = Math.max(1, Math.ceil(recommendationItems.length / recommendationsPerPage))
  const currentRecommendationPage = Math.min(recommendationPage, recommendationTotalPages)
  const recommendationStart = (currentRecommendationPage - 1) * recommendationsPerPage
  const recommendationEnd = recommendationStart + recommendationsPerPage
  const pagedRecommendations = recommendationItems.slice(recommendationStart, recommendationEnd)
  const recommendationCount = recommendationItems.length
  const recommendationRangeStart = recommendationCount === 0 ? 0 : recommendationStart + 1
  const recommendationRangeEnd = Math.min(recommendationEnd, recommendationCount)

  const filteredCatalogItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesSearch =
        catalogSearch === "" ||
        item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        (item.brand || "").toLowerCase().includes(catalogSearch.toLowerCase())

      const matchesCategory = catalogCategoryFilter === "all" || item.category === catalogCategoryFilter
      const matchesBrand = catalogBrandFilter === "all" || (item.brand || "その他") === catalogBrandFilter
      const matchesSeason = catalogSeasonFilter === "all" || item.season === catalogSeasonFilter
      const matchesStatus = catalogStatusFilter === "all" || item.status === catalogStatusFilter

      return matchesSearch && matchesCategory && matchesBrand && matchesSeason && matchesStatus
    })
  }, [catalogItems, catalogSearch, catalogCategoryFilter, catalogBrandFilter, catalogSeasonFilter, catalogStatusFilter])

  const catalogItemsPerPage = 20
  const catalogTotalPages = Math.max(1, Math.ceil(filteredCatalogItems.length / catalogItemsPerPage))
  const currentCatalogPage = Math.min(catalogPage, catalogTotalPages)
  const catalogStart = (currentCatalogPage - 1) * catalogItemsPerPage
  const catalogEnd = catalogStart + catalogItemsPerPage
  const pagedCatalogItems = filteredCatalogItems.slice(catalogStart, catalogEnd)
  const catalogRangeStart = filteredCatalogItems.length === 0 ? 0 : catalogStart + 1
  const catalogRangeEnd = Math.min(catalogEnd, filteredCatalogItems.length)

  const renderCatalogEditDialog = (product: CatalogItem, trigger: React.ReactNode) => (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>商品編集</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">商品名</p>
              <Input value={product.name} onChange={(e) => updateCatalogItem(product.id, { name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">商品コード</p>
              <Input value={product.id} disabled />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">メーカー</p>
              <Input
                value={product.manufacturer}
                onChange={(e) => updateCatalogItem(product.id, { manufacturer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">カテゴリ</p>
              <Input
                value={product.category}
                onChange={(e) => updateCatalogItem(product.id, { category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ブランド</p>
              <Input
                value={product.brand}
                onChange={(e) => updateCatalogItem(product.id, { brand: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">シーズン</p>
              <Select
                value={product.season}
                onValueChange={(value: string) => updateCatalogItem(product.id, { season: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="SS">SS</SelectItem>
                  <SelectItem value="AW">AW</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">価格</p>
              <Input
                type="number"
                value={product.price}
                onChange={(e) => updateCatalogItem(product.id, { price: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">現在庫</p>
                <Input
                  type="number"
                  value={product.currentStock}
                  onChange={(e) => updateCatalogItem(product.id, { currentStock: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">推奨発注</p>
                <Input
                  type="number"
                  value={product.suggestedOrder}
                  onChange={(e) => updateCatalogItem(product.id, { suggestedOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ステータス</p>
              <Select
                value={product.status}
                onValueChange={(value: CatalogItem["status"]) => updateCatalogItem(product.id, { status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高需要</SelectItem>
                  <SelectItem value="overstock">過剰</SelectItem>
                  <SelectItem value="normal">通常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">カラー</p>
              <Input
                value={product.colors.join(", ")}
                onChange={(e) =>
                  updateCatalogItem(product.id, {
                    colors: e.target.value.split(",").map((color) => color.trim()).filter(Boolean),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">サイズ</p>
              <Input
                value={product.sizes.join(", ")}
                onChange={(e) =>
                  updateCatalogItem(product.id, {
                    sizes: e.target.value.split(",").map((size) => size.trim()).filter(Boolean),
                  })
                }
              />
            </div>
            <Button className="w-full bg-[#345fe1] hover:bg-[#2a4bb3] text-white">保存（ダミー）</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const renderCatalog = () => (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">商品一覧</CardTitle>
            <p className="text-xs text-muted-foreground">1万件規模の在庫を表形式で管理できます。</p>
          </div>
          <Badge variant="outline" className="bg-muted/40">
            {filteredCatalogItems.length} 件
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-55">
            <Input
              placeholder="商品名 / JAN / ブランド / メーカー"
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
                {catalogCategories.map((cat) => (
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
                {catalogBrands.map((brand) => (
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
                <SelectItem value="SS">SS</SelectItem>
                <SelectItem value="AW">AW</SelectItem>
              </SelectContent>
            </Select>
            <Select
            value={catalogStatusFilter}
            onValueChange={(value: string) => {
              setCatalogStatusFilter(value)
              setCatalogPage(1)
            }}
            >
            <SelectTrigger className="w-37.5">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">全ステータス</SelectItem>
                <SelectItem value="high">高需要</SelectItem>
                <SelectItem value="overstock">過剰</SelectItem>
                <SelectItem value="normal">通常</SelectItem>
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
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">メーカー</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ブランド</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">カテゴリ</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">シーズン</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">価格</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">在庫</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">推奨</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">状態</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">編集</th>
              </tr>
            </thead>
            <tbody>
              {pagedCatalogItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    条件に一致する商品がありません。
                  </td>
                </tr>
              ) : (
                pagedCatalogItems.map((product) => (
                  <tr key={product.id} className="border-t border-border/70">
                    <td className="px-3 py-2 text-xs text-muted-foreground">{product.id}</td>
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{product.manufacturer}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{product.brand}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{product.category}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{product.season}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(product.price)}</td>
                    <td className="px-3 py-2 text-right">{product.currentStock}</td>
                    <td className="px-3 py-2 text-right">{product.suggestedOrder}</td>
                    <td className="px-3 py-2">
                      <Badge
                        className={cn(
                          "text-[11px]",
                          product.status === "high"
                            ? "bg-green-100 text-green-700"
                            : product.status === "overstock"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700",
                        )}
                      >
                        {product.status === "high" ? "高需要" : product.status === "overstock" ? "過剰" : "通常"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {renderCatalogEditDialog(
                        product,
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
            {filteredCatalogItems.length === 0
              ? "0 件"
              : `${catalogRangeStart}-${catalogRangeEnd} 件 / ${filteredCatalogItems.length} 件`}
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
                    提案 {recommendationCount} 件
                  </Badge>
                  <Badge variant="outline" className="bg-muted/40">
                    仕入れリスト {procurementItems.length} 件
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                高需要のみを抽出し、回転数（推定）や想定売上金額で仕入判断をサポートします。
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
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">現在庫</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">推奨発注</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">回転数(推定)</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">想定売上</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">ステータス</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRecommendations.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          現在、提案対象の在庫はありません。
                        </td>
                      </tr>
                    ) : (
                      pagedRecommendations.map((item) => {
                        const isAdded = isItemAdded(item.id)
                        return (
                          <tr key={item.id} className="border-t border-border/70 hover:bg-muted/40">
                            <td className="px-4 py-3 text-xs text-muted-foreground">{item.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{item.category}</td>
                            <td className="px-4 py-3 text-right font-medium">{item.currentStock}点</td>
                            <td className="px-4 py-3 text-right font-bold text-[#345fe1]">{item.suggestedOrder}点</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {formatRotation(calcRotation(item))} 回
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-foreground">
                              {formatCurrency(item.suggestedOrder * item.price)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                className={cn(
                                  "px-3 py-1",
                                  item.status === "high"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100",
                                )}
                              >
                                {item.status === "high" ? (
                                  <>
                                    <TrendingUp className="w-3 h-3 mr-1 text-[#345fe1]" />
                                    高需要
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3 h-3 mr-1 text-[#345fe1]" />
                                    過剰在庫
                                  </>
                                )}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant={isAdded ? "outline" : "default"}
                                onClick={() => handleAddToProcurement(item)}
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
