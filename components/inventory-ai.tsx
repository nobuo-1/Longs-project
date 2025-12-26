"use client"

import { useState, useMemo } from "react"
import { TrendingUp, AlertTriangle, Search, ShoppingCart, Package, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { cn } from "@/lib/utils"

interface InventoryAIProps {
  initialTab?: "recommendations" | "table" | "catalog"
}

const salesDataByStore = {
  all: [
    { month: "1月", 過去売上: 120, 予測需要: 130, 現在売上: 125 },
    { month: "2月", 過去売上: 150, 予測需要: 160, 現在売上: 158 },
    { month: "3月", 過去売上: 200, 予測需要: 220, 現在売上: 215 },
    { month: "4月", 過去売上: 180, 予測需要: 190, 現在売上: 185 },
    { month: "5月", 過去売上: 220, 予測需要: 250, 現在売上: 240 },
    { month: "6月", 過去売上: 190, 予測需要: 200, 現在売上: null },
  ],
  shibuya: [
    { month: "1月", 過去売上: 45, 予測需要: 50, 現在売上: 48 },
    { month: "2月", 過去売上: 60, 予測需要: 65, 現在売上: 63 },
    { month: "3月", 過去売上: 85, 予測需要: 95, 現在売上: 92 },
    { month: "4月", 過去売上: 75, 予測需要: 80, 現在売上: 78 },
    { month: "5月", 過去売上: 90, 予測需要: 105, 現在売上: 100 },
    { month: "6月", 過去売上: 80, 予測需要: 85, 現在売上: null },
  ],
  shinjuku: [
    { month: "1月", 過去売上: 40, 予測需要: 42, 現在売上: 41 },
    { month: "2月", 過去売上: 48, 予測需要: 52, 現在売上: 50 },
    { month: "3月", 過去売上: 65, 予測需要: 70, 現在売上: 68 },
    { month: "4月", 過去売上: 58, 予測需要: 62, 現在売上: 60 },
    { month: "5月", 過去売上: 72, 予測需要: 80, 現在売上: 76 },
    { month: "6月", 過去売上: 62, 予測需要: 68, 現在売上: null },
  ],
  ginza: [
    { month: "1月", 過去売上: 35, 予測需要: 38, 現在売上: 36 },
    { month: "2月", 過去売上: 42, 予測需要: 43, 現在売上: 45 },
    { month: "3月", 過去売上: 50, 予測需要: 55, 現在売上: 55 },
    { month: "4月", 過去売上: 47, 予測需要: 48, 現在売上: 47 },
    { month: "5月", 過去売上: 58, 予測需要: 65, 現在売上: 64 },
    { month: "6月", 過去売上: 48, 予測需要: 47, 現在売上: null },
  ],
}

const categorySalesData = [
  { name: "トップス", value: 35, color: "#345fe1" },
  { name: "ボトムス", value: 25, color: "#22c55e" },
  { name: "アウター", value: 20, color: "#f59e0b" },
  { name: "シューズ", value: 12, color: "#8b5cf6" },
  { name: "アクセサリー", value: 8, color: "#ec4899" },
]

const monthlyComparisonData = [
  { month: "1月", 今年: 125, 昨年: 110 },
  { month: "2月", 今年: 158, 昨年: 140 },
  { month: "3月", 今年: 215, 昨年: 185 },
  { month: "4月", 今年: 185, 昨年: 165 },
  { month: "5月", 今年: 240, 昨年: 200 },
  { month: "6月", 今年: 180, 昨年: 175 },
]

const stockTurnoverData = [
  { category: "トップス", 回転率: 4.2, 目標: 4.0 },
  { category: "ボトムス", 回転率: 3.8, 目標: 4.0 },
  { category: "アウター", 回転率: 2.5, 目標: 3.0 },
  { category: "シューズ", 回転率: 3.2, 目標: 3.5 },
  { category: "アクセサリー", 回転率: 5.1, 目標: 4.5 },
]

const productCatalog = [
  {
    id: "SKU001",
    name: "春物ジャケット（ネイビー）",
    category: "アウター",
    manufacturer: "TOKYO BRAND",
    price: 15800,
    currentStock: 12,
    suggestedOrder: 30,
    status: "high" as const,
    image: "/navy-spring-jacket-apparel.jpg",
    colors: ["ネイビー", "グレー", "ベージュ"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "SKU002",
    name: "コットンTシャツ（白）",
    category: "トップス",
    manufacturer: "BASIC WEAR",
    price: 3980,
    currentStock: 45,
    suggestedOrder: 60,
    status: "high" as const,
    image: "/white-cotton-t-shirt-apparel.jpg",
    colors: ["白", "黒", "グレー", "ネイビー"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "SKU003",
    name: "デニムパンツ（ブルー）",
    category: "ボトムス",
    manufacturer: "DENIM CO",
    price: 8900,
    currentStock: 35,
    suggestedOrder: 25,
    status: "overstock" as const,
    image: "/blue-denim-jeans-pants.jpg",
    colors: ["ライトブルー", "インディゴ", "ブラック"],
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "SKU004",
    name: "リネンシャツ（ベージュ）",
    category: "トップス",
    manufacturer: "SUMMER LINE",
    price: 6800,
    currentStock: 8,
    suggestedOrder: 40,
    status: "high" as const,
    image: "/beige-linen-shirt-apparel.jpg",
    colors: ["ベージュ", "白", "ライトブルー"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "SKU005",
    name: "ウールコート（グレー）",
    category: "アウター",
    manufacturer: "WINTER STYLE",
    price: 29800,
    currentStock: 28,
    suggestedOrder: 10,
    status: "overstock" as const,
    image: "/grey-wool-coat-apparel.jpg",
    colors: ["グレー", "ネイビー", "キャメル"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "SKU006",
    name: "スニーカー（白）",
    category: "シューズ",
    manufacturer: "STEP FORWARD",
    price: 12800,
    currentStock: 22,
    suggestedOrder: 35,
    status: "high" as const,
    image: "/white-sneakers-shoes.jpg",
    colors: ["白", "黒", "グレー"],
    sizes: ["23", "24", "25", "26", "27", "28"],
  },
  {
    id: "SKU007",
    name: "レザーベルト（茶）",
    category: "アクセサリー",
    manufacturer: "CLASSIC LEATHER",
    price: 4500,
    currentStock: 55,
    suggestedOrder: 20,
    status: "normal" as const,
    image: "/brown-leather-belt-accessory.jpg",
    colors: ["ブラウン", "ブラック"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "SKU008",
    name: "カシミアニット（グレー）",
    category: "トップス",
    manufacturer: "LUXURY KNIT",
    price: 18500,
    currentStock: 15,
    suggestedOrder: 25,
    status: "high" as const,
    image: "/grey-cashmere-sweater-knit.jpg",
    colors: ["グレー", "ネイビー", "ベージュ", "ブラック"],
    sizes: ["S", "M", "L", "XL"],
  },
]

const slowMovingStock = [
  { brand: "UrbanLine", item: "コーデュロイジャケット", days: 120, stock: 24, action: "値引き/セット販売" },
  { brand: "BasicWear", item: "ロゴT（黒）", days: 95, stock: 80, action: "EC限定クーポン" },
  { brand: "DenimCo", item: "ストレートデニム", days: 110, stock: 46, action: "店舗間移動" },
]

const rotationLeaders = [
  { category: "トップス", brand: "BasicWear", rotation: 5.2, quantity: 520 },
  { category: "アウター", brand: "LuxeCoat", rotation: 3.8, quantity: 210 },
  { category: "シューズ", brand: "StepForward", rotation: 4.5, quantity: 180 },
]

const categoryAging = [
  { category: "アウター", days: 65, target: 75, status: "ok" as const },
  { category: "トップス", days: 85, target: 70, status: "warn" as const },
  { category: "アクセサリー", days: 55, target: 60, status: "ok" as const },
  { category: "ボトムス", days: 98, target: 80, status: "alert" as const },
]

const columnBlueprints = [
  {
    title: "売上/粗利カラム",
    accent: "bg-[#345fe1]/10 text-[#345fe1]",
    items: ["得意先分類1名", "ブランド名", "アイテム名", "商品名1", "純売上数量", "純売上金額", "粗利金額", "粗利率(%)"],
  },
  {
    title: "仕入/支払カラム",
    accent: "bg-emerald-500/10 text-emerald-700",
    items: ["支払先略称", "純仕入金額", "税込仕入金額", "支払額", "当月末残高"],
  },
  {
    title: "請求/入金カラム",
    accent: "bg-amber-500/10 text-amber-700",
    items: ["請求先略称", "入金額", "純売上金額", "税込売上金額", "当月末残高", "与信枠残高"],
  },
  {
    title: "年度・粗利推移カラム",
    accent: "bg-slate-500/10 text-slate-700",
    items: ["担当者名", "年度", "得意先分類1名", "純売上金額", "粗利金額", "粗利率(%)"],
  },
]

export function InventoryAI({ initialTab = "recommendations" }: InventoryAIProps) {
  const [store, setStore] = useState("all")
  const [category, setCategory] = useState("all")
  const [manufacturer, setManufacturer] = useState("all")
  const [period, setPeriod] = useState("month")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    return productCatalog.filter((product) => {
      const matchesCategory =
        category === "all" ||
        (category === "tops" && product.category === "トップス") ||
        (category === "bottoms" && product.category === "ボトムス") ||
        (category === "outerwear" && product.category === "アウター") ||
        (category === "shoes" && product.category === "シューズ") ||
        (category === "accessories" && product.category === "アクセサリー")

      const matchesManufacturer =
        manufacturer === "all" ||
        (manufacturer === "tokyo" && product.manufacturer === "TOKYO BRAND") ||
        (manufacturer === "basic" && product.manufacturer === "BASIC WEAR") ||
        (manufacturer === "denim" && product.manufacturer === "DENIM CO") ||
        (manufacturer === "summer" && product.manufacturer === "SUMMER LINE") ||
        (manufacturer === "winter" && product.manufacturer === "WINTER STYLE")

      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesManufacturer && matchesSearch
    })
  }, [category, manufacturer, searchQuery])

  const salesData = salesDataByStore[store as keyof typeof salesDataByStore] || salesDataByStore.all

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderCatalog = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">商品カタログ（商品DB参照）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Dialog key={product.id}>
              <DialogTrigger asChild>
                <div className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                  />
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.manufacturer}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-[#345fe1]">{formatCurrency(product.price)}</p>
                    <Badge
                      className={cn(
                        "text-xs",
                        product.status === "high"
                          ? "bg-green-100 text-green-700"
                          : product.status === "overstock"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700",
                      )}
                    >
                      {product.status === "high" ? "高需要" : product.status === "overstock" ? "過剰" : "通常"}
                    </Badge>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">商品コード</p>
                      <p className="font-mono font-medium">{product.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">カテゴリ</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">メーカー</p>
                      <p className="font-medium">{product.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">価格</p>
                      <p className="font-bold text-xl text-[#345fe1]">{formatCurrency(product.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">カラー</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.colors.map((color) => (
                          <span key={color} className="px-2 py-1 bg-muted rounded text-xs">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">サイズ</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.sizes.map((size) => (
                          <span key={size} className="px-2 py-1 bg-muted rounded text-xs">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <div className="flex-1 p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">現在庫</p>
                        <p className="text-xl font-bold">{product.currentStock}</p>
                      </div>
                      <div className="flex-1 p-3 bg-[#345fe1]/10 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">推奨発注</p>
                        <p className="text-xl font-bold text-[#345fe1]">{product.suggestedOrder}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-[#345fe1] hover:bg-[#2a4bb3] text-white">発注に追加</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{initialTab === "catalog" ? "商品カタログ" : "在庫AI"}</h2>
        <p className="text-muted-foreground">
          {initialTab === "catalog" ? "商品DBからの参照" : "過去データに基づく最適在庫提案"}
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="商品名、SKU、メーカー..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">店舗</label>
              <Select value={store} onValueChange={setStore}>
                <SelectTrigger>
                  <SelectValue placeholder="店舗を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全店舗</SelectItem>
                  <SelectItem value="shibuya">渋谷店</SelectItem>
                  <SelectItem value="shinjuku">新宿店</SelectItem>
                  <SelectItem value="ginza">銀座店</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">カテゴリ</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全カテゴリ</SelectItem>
                  <SelectItem value="tops">トップス</SelectItem>
                  <SelectItem value="bottoms">ボトムス</SelectItem>
                  <SelectItem value="outerwear">アウター</SelectItem>
                  <SelectItem value="shoes">シューズ</SelectItem>
                  <SelectItem value="accessories">アクセサリー</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">メーカー</label>
              <Select value={manufacturer} onValueChange={setManufacturer}>
                <SelectTrigger>
                  <SelectValue placeholder="メーカーを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全メーカー</SelectItem>
                  <SelectItem value="tokyo">TOKYO BRAND</SelectItem>
                  <SelectItem value="basic">BASIC WEAR</SelectItem>
                  <SelectItem value="denim">DENIM CO</SelectItem>
                  <SelectItem value="summer">SUMMER LINE</SelectItem>
                  <SelectItem value="winter">WINTER STYLE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">期間</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">月次</SelectItem>
                  <SelectItem value="season">シーズン</SelectItem>
                  <SelectItem value="year">年次</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-[#345fe1]" />
              在庫効率サマリー
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              取得カラムに基づき、回転率・滞留・カテゴリ別目標を俯瞰。仕入れ量の最適化と不動在庫の可視化を狙います。
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">回転率が高いブランド/カテゴリ</p>
              <div className="space-y-2">
                {rotationLeaders.map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{row.brand}</p>
                      <p className="text-xs text-muted-foreground">{row.category}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700" variant="outline">
                      回転 {row.rotation} 回
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">滞留・不動在庫（一定期間未販売）</p>
              <div className="space-y-2">
                {slowMovingStock.map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{row.item}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.brand} ｜ {row.days}日滞留
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {row.action}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg md:col-span-2">
              <p className="text-xs text-muted-foreground mb-2">カテゴリ別 売り切り目標日数</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categoryAging.map((cat, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-lg border",
                      cat.status === "ok" && "border-green-200 bg-green-50",
                      cat.status === "warn" && "border-yellow-200 bg-yellow-50",
                      cat.status === "alert" && "border-red-200 bg-red-50",
                    )}
                  >
                    <p className="text-sm font-semibold">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">平均 {cat.days}日 / 目標 {cat.target}日</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">在庫アラート・リストアップ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-[#345fe1]/10">
              <p className="text-sm font-semibold text-[#345fe1]">売れていない在庫</p>
              <p className="text-xs text-muted-foreground">90日以上滞留: 6 SKU / 220点</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 text-orange-800">
              <p className="text-sm font-semibold">仕入過多リスク</p>
              <p className="text-xs">ボトムス：仕入計画に対し在庫率 130%</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800">
              <p className="text-sm font-semibold">発注余力</p>
              <p className="text-xs">トップス：在庫回転 5.2回 → 追加発注余地あり</p>
            </div>
            <Button variant="outline" className="w-full">
              在庫データハブを開く
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">取得カラムとビュー整理</CardTitle>
          <p className="text-sm text-muted-foreground">売上・仕入・請求・年度粗利のカラムセットをまとめて確認できます。</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {columnBlueprints.map((group) => (
            <div key={group.title} className="p-3 border border-border rounded-lg space-y-2">
              <span className={cn("text-xs px-2 py-1 rounded-full inline-block", group.accent)}>{group.title}</span>
              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                {group.items.map((item) => (
                  <span key={item} className="px-2 py-1 bg-muted rounded-md">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {initialTab === "catalog" ? (
        renderCatalog()
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">売上推移 & 需要予測</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="過去売上"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={{ fill: "#94a3b8" }}
                      name="過去売上（昨年）"
                    />
                    <Line
                      type="monotone"
                      dataKey="現在売上"
                      stroke="#345fe1"
                      strokeWidth={3}
                      dot={{ fill: "#345fe1" }}
                      name="現在売上（今年）"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="予測需要"
                      stroke="#22c55e"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#22c55e" }}
                      name="予測需要"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {/* Category Sales Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#345fe1]" />
                  カテゴリ別売上構成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySalesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {categorySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Year over Year Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#345fe1]" />
                  前年比較
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="昨年" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="今年" fill="#345fe1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stock Turnover Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#345fe1]" />
                  在庫回転率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockTurnoverData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" fontSize={10} />
                      <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={10} width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="回転率" fill="#345fe1" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="目標" fill="#22c55e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#345fe1]" />
                売上トレンド推移
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="過去売上"
                      stackId="1"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="予測需要"
                      stackId="2"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">仕入れ提案</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredProducts
                  .filter((p) => p.status !== "normal")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.category} • {item.manufacturer} • {item.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">現在庫</p>
                          <p className="font-medium">{item.currentStock}点</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">推奨発注数</p>
                          <p className="font-bold text-[#345fe1]">{item.suggestedOrder}点</p>
                        </div>
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
                              <TrendingUp className="w-3 h-3 mr-1" />
                              高需要
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              過剰在庫
                            </>
                          )}
                        </Badge>
                        <Button size="sm" className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white">
                          発注に追加
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
