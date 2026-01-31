"use client"

import { useMemo, useState } from "react"
import { Package, BarChart2, ShoppingCart, AlertTriangle, TrendingDown, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

const RADIAN = Math.PI / 180

const categorySalesData = [
  { name: "トップス", value: 35, color: "#dbeafe" },
  { name: "ボトムス", value: 25, color: "#dcfce7" },
  { name: "アウター", value: 20, color: "#ffedd5" },
  { name: "シューズ", value: 12, color: "#ede9fe" },
  { name: "アクセサリー", value: 8, color: "#fce7f3" },
]

const renderCategoryLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.75
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#1f2937">
      <tspan x={x} dy="-0.2em" fontWeight="bold">
        {name}
      </tspan>
      <tspan x={x} dy="1.2em" fontWeight="bold">
        {value}%
      </tspan>
    </text>
  )
}

type InventoryAlert = {
  id: number
  type: "low_stock" | "overstock" | "expiring"
  severity: "critical" | "warning" | "info"
  product: string
  productId: string
  category: string
  currentStock: number
  threshold: number
  message: string
  date: string
}

const alertsData: InventoryAlert[] = [
  {
    id: 1,
    type: "low_stock",
    severity: "critical",
    product: "春物ジャケット（ネイビー）",
    productId: "SKU001",
    category: "アウター",
    currentStock: 3,
    threshold: 10,
    message: "在庫が危険水準です。即座に発注が必要です。",
    date: "2024/12/19 10:30",
  },
  {
    id: 2,
    type: "low_stock",
    severity: "critical",
    product: "リネンシャツ（ベージュ）",
    productId: "SKU004",
    category: "トップス",
    currentStock: 5,
    threshold: 15,
    message: "来週の需要予測に対して在庫が不足しています。",
    date: "2024/12/19 09:15",
  },
  {
    id: 3,
    type: "overstock",
    severity: "warning",
    product: "ウールコート（グレー）",
    productId: "SKU005",
    category: "アウター",
    currentStock: 45,
    threshold: 20,
    message: "在庫過剰です。セール販売を検討してください。",
    date: "2024/12/18 16:45",
  },
  {
    id: 4,
    type: "expiring",
    severity: "warning",
    product: "デニムパンツ（ブルー）",
    productId: "SKU003",
    category: "ボトムス",
    currentStock: 35,
    threshold: 30,
    message: "季節商品のため、在庫消化が必要です。",
    date: "2024/12/18 14:20",
  },
  {
    id: 5,
    type: "overstock",
    severity: "info",
    product: "レザーベルト（茶）",
    productId: "SKU007",
    category: "アクセサリー",
    currentStock: 55,
    threshold: 40,
    message: "在庫が多めですが、ギフトシーズンで消化見込み。",
    date: "2024/12/16 09:30",
  },
]

const getAlertTypeLabel = (type: InventoryAlert["type"]) => {
  switch (type) {
    case "low_stock":
      return "在庫不足"
    case "overstock":
      return "過剰在庫"
    case "expiring":
      return "廃品リスク"
    default:
      return "アラート"
  }
}

const getAlertIcon = (type: InventoryAlert["type"]) => {
  switch (type) {
    case "low_stock":
      return <TrendingDown className="w-4 h-4" />
    case "overstock":
      return <Package className="w-4 h-4" />
    case "expiring":
      return <Clock className="w-4 h-4" />
    default:
      return <AlertTriangle className="w-4 h-4" />
  }
}

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

const salesForecastData = [
  { month: "1月", 過去売上: 120, 現在売上: 128, 予測需要: 132 },
  { month: "2月", 過去売上: 150, 現在売上: 158, 予測需要: 162 },
  { month: "3月", 過去売上: 200, 現在売上: 215, 予測需要: 222 },
  { month: "4月", 過去売上: 180, 現在売上: 185, 予測需要: 192 },
  { month: "5月", 過去売上: 220, 現在売上: 240, 予測需要: 250 },
  { month: "6月", 過去売上: 190, 現在売上: 198, 予測需要: 205 },
  { month: "7月", 過去売上: 210, 現在売上: 225, 予測需要: 232 },
  { month: "8月", 過去売上: 240, 現在売上: 255, 予測需要: 262 },
  { month: "9月", 過去売上: 230, 現在売上: 245, 予測需要: 250 },
  { month: "10月", 過去売上: 260, 現在売上: 275, 予測需要: 285 },
  { month: "11月", 過去売上: 280, 現在売上: 295, 予測需要: 305 },
  { month: "12月", 過去売上: 320, 現在売上: 340, 予測需要: 355 },
]

const forecastCategories = ["全体", "アウター", "トップス", "ボトムス", "シューズ", "アクセサリー"] as const

const buildCategoryForecast = (multiplier: number, variance: number) =>
  salesForecastData.map((item, index) => {
    const wobble = index % 3 === 0 ? variance : index % 3 === 1 ? -variance : 0
    return {
      month: item.month,
      過去売上: Math.round(item.過去売上 * multiplier + wobble),
      現在売上: Math.round(item.現在売上 * multiplier + wobble),
      予測需要: Math.round(item.予測需要 * multiplier + wobble),
    }
  })

const salesForecastByCategory: Record<(typeof forecastCategories)[number], typeof salesForecastData> = {
  全体: salesForecastData,
  アウター: buildCategoryForecast(0.92, 6),
  トップス: buildCategoryForecast(1.05, 8),
  ボトムス: buildCategoryForecast(0.98, 5),
  シューズ: buildCategoryForecast(0.9, 4),
  アクセサリー: buildCategoryForecast(0.88, 3),
}

const rotationLeaders = Array.from({ length: 100 }, (_, index) => {
  const categories = ["トップス", "ボトムス", "アウター", "シューズ", "アクセサリー"]
  const brands = ["UrbanLine", "BasicWear", "LuxeCoat", "DenimCo", "StepForward", "ClassicLeather", "KnitLab", "WinterStyle", "RunStudio", "DailyFit"]
  const category = categories[index % categories.length]
  const brand = brands[index % brands.length]
  const rotation = Number((4.0 + (index % 20) * 0.1).toFixed(1))
  const quantity = 120 + (index % 25) * 18
  return { category, brand: `${brand} ${index + 1}`, rotation, quantity }
})

const categoryAging = [
  { category: "アウター", days: 65, target: 75, status: "ok" as const },
  { category: "トップス", days: 85, target: 70, status: "warn" as const },
  { category: "アクセサリー", days: 55, target: 60, status: "ok" as const },
  { category: "ボトムス", days: 98, target: 80, status: "alert" as const },
]

export function InventoryAIInsights() {
  const [goodPage, setGoodPage] = useState(1)
  const [alertType, setAlertType] = useState<InventoryAlert["type"]>("low_stock")
  const [alertPage, setAlertPage] = useState(1)
  const [forecastCategory, setForecastCategory] = useState<(typeof forecastCategories)[number]>("全体")

  const alertCounts = useMemo(
    () =>
      alertsData.reduce(
        (acc, alert) => {
          acc[alert.type] += 1
          return acc
        },
        { low_stock: 0, overstock: 0, expiring: 0 } as Record<InventoryAlert["type"], number>,
      ),
    [],
  )

  const filteredAlerts = useMemo(() => alertsData.filter((alert) => alert.type === alertType), [alertType])
  const alertsPerPage = 12
  const alertTotalPages = Math.max(1, Math.ceil(filteredAlerts.length / alertsPerPage))
  const currentAlertPage = Math.min(alertPage, alertTotalPages)
  const alertStart = (currentAlertPage - 1) * alertsPerPage
  const alertEnd = alertStart + alertsPerPage
  const pagedAlerts = filteredAlerts.slice(alertStart, alertEnd)

  const goodItemsPerPage = 8
  const goodTotalPages = Math.max(1, Math.ceil(rotationLeaders.length / goodItemsPerPage))
  const currentGoodPage = Math.min(goodPage, goodTotalPages)
  const goodStart = (currentGoodPage - 1) * goodItemsPerPage
  const goodEnd = goodStart + goodItemsPerPage
  const pagedGoodItems = rotationLeaders.slice(goodStart, goodEnd)

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Inventory AI</p>
        <h2 className="text-2xl font-bold text-foreground">在庫データ分析</h2>
        <p className="text-muted-foreground">
          カテゴリ構成・前年比較・回転率・在庫効率・アラート分析をまとめて確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-[#345fe1]" />
              カテゴリ別売上構成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-55">
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
                    label={renderCategoryLabel}
                    labelLine={false}
                    stroke="#ffffff"
                    strokeWidth={2}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#345fe1]" />
              前年比較
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-55">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#345fe1]" />
              在庫回転率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-55">
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
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">売上推移 & 需要予測</CardTitle>
          <div className="flex flex-wrap gap-2">
            {forecastCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setForecastCategory(category)}
                className={cn(
                  "h-7 px-3 rounded-full text-xs",
                  forecastCategory === category
                    ? "bg-[#345fe1] text-white border-transparent hover:bg-[#2a4bb3]"
                    : "bg-white text-muted-foreground",
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesForecastByCategory[forecastCategory]}>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-[#345fe1]" />
            在庫効率分析
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            優良在庫の回転ランキングと、売り切り目標の状況を確認できます。
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">優良在庫ランキング</p>
                  <p className="text-xs text-muted-foreground">回転率の高い商品をランキング表示</p>
                </div>
                <Badge variant="outline" className="bg-muted/40">
                  上位 {rotationLeaders.length} 件
                </Badge>
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">順位</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ブランド</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">カテゴリ</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">回転率</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">販売数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedGoodItems.map((row, index) => (
                      <tr key={`${row.brand}-${index}`} className="border-t border-border/70">
                        <td className="px-3 py-2 text-xs text-muted-foreground">#{goodStart + index + 1}</td>
                        <td className="px-3 py-2 font-medium text-foreground">{row.brand}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{row.category}</td>
                        <td className="px-3 py-2 text-right font-semibold text-[#345fe1]">{row.rotation} 回</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{row.quantity} 点</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {rotationLeaders.length === 0
                    ? "0 件"
                    : `${goodStart + 1}-${Math.min(goodEnd, rotationLeaders.length)} 件 / ${rotationLeaders.length} 件`}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGoodPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentGoodPage === 1}
                  >
                    前へ
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentGoodPage} / {goodTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGoodPage((prev) => Math.min(goodTotalPages, prev + 1))}
                    disabled={currentGoodPage === goodTotalPages}
                  >
                    次へ
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#345fe1]" />
            在庫アラート分析
          </CardTitle>
          <p className="text-sm text-muted-foreground">在庫不足・過剰・廃品リスクを分類して確認できます。</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "low_stock", label: "在庫不足", tone: "text-red-600 border-red-200" },
                  { id: "overstock", label: "過剰在庫", tone: "text-orange-600 border-orange-200" },
                  { id: "expiring", label: "廃品リスク", tone: "text-purple-600 border-purple-200" },
                ] as const).map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAlertType(item.id)
                      setAlertPage(1)
                    }}
                    className={cn(
                      "h-auto flex flex-col items-start gap-1 px-3 py-2 transition-all",
                      alertType === item.id
                        ? "bg-[#345fe1] border-[#345fe1] text-white shadow-md"
                        : "bg-white border-border text-muted-foreground hover:border-[#345fe1]/50 hover:text-[#345fe1]",
                    )}
                  >
                    <span className="text-[11px]">{item.label}</span>
                    <span className="text-lg font-bold">{alertCounts[item.id]}</span>
                  </Button>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
                1ページに最大 {alertsPerPage} 件を表示します。
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="text-[#345fe1]">{getAlertIcon(alertType)}</span>
                    <span>在庫アラート: {getAlertTypeLabel(alertType)}</span>
                  </div>
                  <Badge variant="outline" className="bg-muted/40">
                    {filteredAlerts.length} 件
                  </Badge>
                </div>
                <div className="space-y-2 max-h-105 overflow-auto p-3">
                  {pagedAlerts.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      該当するアラートはありません
                    </div>
                  ) : (
                    pagedAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "rounded-lg border p-3 flex items-start gap-3",
                          alert.type === "low_stock"
                            ? "border-red-200"
                            : alert.type === "overstock"
                              ? "border-orange-200"
                              : "border-purple-200",
                        )}
                      >
                        <div className="mt-0.5 text-[#345fe1]">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{alert.product}</span>
                            <Badge
                              className={cn(
                                "text-[11px]",
                                alert.type === "low_stock"
                                  ? "bg-red-100 text-red-700"
                                  : alert.type === "overstock"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-purple-100 text-purple-700",
                              )}
                            >
                              {getAlertTypeLabel(alert.type)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                            <Badge variant="outline" className="text-[11px]">
                              {alert.productId}
                            </Badge>
                            <Badge variant="outline" className="text-[11px]">
                              {alert.category}
                            </Badge>
                            <span>{alert.date}</span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>現在庫</p>
                          <p className="text-base font-bold text-foreground">{alert.currentStock}</p>
                          <p>基準 {alert.threshold}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {filteredAlerts.length === 0
                    ? "0 件"
                    : `${alertStart + 1}-${Math.min(alertEnd, filteredAlerts.length)} 件 / ${filteredAlerts.length} 件`}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAlertPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentAlertPage === 1}
                  >
                    前へ
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentAlertPage} / {alertTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAlertPage((prev) => Math.min(alertTotalPages, prev + 1))}
                    disabled={currentAlertPage === alertTotalPages}
                  >
                    次へ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
