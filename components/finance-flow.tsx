"use client"

import { useState } from "react"
import { Wallet, ArrowUpCircle, ArrowDownCircle, Calendar, ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface FinanceFlowProps {
  initialTab?: "overview" | "reserve" | "gantt"
}

const totalAssets = 15000000 // 15 million yen

const cashFlowData = [
  {
    id: 1,
    date: "2024-04-05",
    endDate: "2024-04-05",
    description: "春物入荷支払い",
    amount: -2500000,
    category: "仕入れ",
    type: "expense" as const,
  },
  {
    id: 2,
    date: "2024-04-10",
    endDate: "2024-04-10",
    description: "売上入金（3月分）",
    amount: 4200000,
    category: "売上",
    type: "income" as const,
  },
  {
    id: 3,
    date: "2024-04-15",
    endDate: "2024-04-15",
    description: "家賃・光熱費",
    amount: -850000,
    category: "固定費",
    type: "expense" as const,
  },
  {
    id: 4,
    date: "2024-04-20",
    endDate: "2024-04-20",
    description: "人件費",
    amount: -1800000,
    category: "人件費",
    type: "expense" as const,
  },
  {
    id: 5,
    date: "2024-04-25",
    endDate: "2024-04-25",
    description: "売上入金（4月前半）",
    amount: 2100000,
    category: "売上",
    type: "income" as const,
  },
  {
    id: 6,
    date: "2024-04-30",
    endDate: "2024-04-30",
    description: "広告費",
    amount: -300000,
    category: "販促費",
    type: "expense" as const,
  },
  {
    id: 7,
    date: "2024-05-05",
    endDate: "2024-05-08",
    description: "夏物先行入荷",
    amount: -1500000,
    category: "仕入れ",
    type: "expense" as const,
  },
  {
    id: 8,
    date: "2024-05-10",
    endDate: "2024-05-10",
    description: "売上入金（4月後半）",
    amount: 3800000,
    category: "売上",
    type: "income" as const,
  },
  {
    id: 9,
    date: "2024-05-15",
    endDate: "2024-05-15",
    description: "家賃・光熱費",
    amount: -850000,
    category: "固定費",
    type: "expense" as const,
  },
  {
    id: 10,
    date: "2024-05-20",
    endDate: "2024-05-20",
    description: "人件費",
    amount: -1800000,
    category: "人件費",
    type: "expense" as const,
  },
]

const reserveCategories = [
  { id: "emergency", name: "緊急準備金", description: "不測の事態への備え", defaultPercent: 10 },
  { id: "seasonal", name: "季節仕入れ", description: "シーズン商品の仕入れ資金", defaultPercent: 15 },
  { id: "equipment", name: "設備更新", description: "店舗設備の更新・修繕", defaultPercent: 5 },
  { id: "expansion", name: "事業拡大", description: "新店舗・新事業への投資", defaultPercent: 10 },
]

export function FinanceFlow({ initialTab = "overview" }: FinanceFlowProps) {
  const [reserveSettings, setReserveSettings] = useState(
    reserveCategories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.defaultPercent }), {} as Record<string, number>),
  )
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 3, 1)) // April 2024

  const totalReservePercent = Object.values(reserveSettings).reduce((a, b) => a + b, 0)
  const reserveAmount = Math.round(totalAssets * (totalReservePercent / 100))
  const disposableBudget = totalAssets - reserveAmount

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const updateReserveSetting = (id: string, value: number) => {
    setReserveSettings((prev) => ({ ...prev, [id]: value }))
  }

  // Calculate bar widths for timeline visualization
  const maxAmount = Math.max(...cashFlowData.map((item) => Math.abs(item.amount)))

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))
  }

  const currentMonthDays = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getPageTitle = () => {
    switch (initialTab) {
      case "reserve":
        return "内部留保設定"
      case "gantt":
        return "ガントチャート"
      default:
        return "ファイナンスフロー"
    }
  }

  const getPageDescription = () => {
    switch (initialTab) {
      case "reserve":
        return "詳細な内部留保の設定とカスタマイズ"
      case "gantt":
        return "カレンダー形式でのキャッシュフロー管理"
      default:
        return "キャッシュフロー管理と可処分予算計算"
    }
  }

  const assetDistributionData = [
    { name: "可処分予算", value: disposableBudget, color: "#345fe1" },
    { name: "緊急準備金", value: Math.round(totalAssets * (reserveSettings.emergency / 100)), color: "#22c55e" },
    { name: "季節仕入れ", value: Math.round(totalAssets * (reserveSettings.seasonal / 100)), color: "#f97316" },
    { name: "設備更新", value: Math.round(totalAssets * (reserveSettings.equipment / 100)), color: "#a855f7" },
    { name: "事業拡大", value: Math.round(totalAssets * (reserveSettings.expansion / 100)), color: "#ec4899" },
  ]

  const reserveBreakdownData = reserveCategories.map((cat, index) => ({
    name: cat.name,
    value: Math.round(totalAssets * (reserveSettings[cat.id] / 100)),
    percent: reserveSettings[cat.id],
    color: ["#345fe1", "#22c55e", "#f97316", "#a855f7"][index],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-foreground">{payload[0].name}</p>
          <p className="text-[#345fe1] font-bold">{formatCurrency(payload[0].value)}</p>
          {payload[0].payload.percent && <p className="text-muted-foreground text-sm">{payload[0].payload.percent}%</p>}
        </div>
      )
    }
    return null
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#345fe1]" />
              資産配分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {assetDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4 p-4 bg-muted/30 rounded-xl">
              <p className="text-sm text-muted-foreground">総資産</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAssets)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Reserve Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#345fe1]" />
              内部留保内訳
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reserveBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent}%`}
                    labelLine={false}
                  >
                    {reserveBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-muted/30 rounded-xl text-center">
                <p className="text-sm text-muted-foreground">内部留保合計</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(reserveAmount)}</p>
                <p className="text-sm text-[#345fe1]">{totalReservePercent}%</p>
              </div>
              <div className="p-3 bg-[#345fe1]/10 rounded-xl text-center">
                <p className="text-sm text-muted-foreground">可処分予算</p>
                <p className="text-xl font-bold text-[#345fe1]">{formatCurrency(disposableBudget)}</p>
                <p className="text-sm text-[#345fe1]">{100 - totalReservePercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Cash Flow Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              キャッシュフロータイムライン
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#345fe1] rounded" />
                <span className="text-muted-foreground">入金</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-muted-foreground">出金</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-24">日付</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">内容</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-24">カテゴリ</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-32">金額</th>
                  <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-64">タイムライン</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowData.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.type === "income" ? (
                          <ArrowUpCircle className="w-4 h-4 text-[#345fe1]" />
                        ) : (
                          <ArrowDownCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium text-foreground">{item.description}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "py-3 px-4 text-right text-sm font-medium",
                        item.type === "income" ? "text-[#345fe1]" : "text-red-600",
                      )}
                    >
                      {item.type === "income" ? "+" : ""}
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center h-6">
                        <div className="w-full bg-muted rounded-full h-2 relative">
                          <div
                            className={cn("h-2 rounded-full", item.type === "income" ? "bg-[#345fe1]" : "bg-red-500")}
                            style={{
                              width: `${(Math.abs(item.amount) / maxAmount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderReserve = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">内部留保の詳細設定</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reserveCategories.map((cat) => (
            <div key={cat.id} className="p-4 border border-border rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#345fe1]">{reserveSettings[cat.id]}%</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Math.round(totalAssets * (reserveSettings[cat.id] / 100)))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[reserveSettings[cat.id]]}
                  onValueChange={(value) => updateReserveSetting(cat.id, value[0])}
                  max={30}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={reserveSettings[cat.id]}
                  onChange={(e) => updateReserveSetting(cat.id, Number(e.target.value))}
                  className="w-20 text-right"
                  min={0}
                  max={30}
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          ))}

          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="font-medium">内部留保合計</p>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{formatCurrency(reserveAmount)}</p>
                <p className="text-sm text-muted-foreground">{totalReservePercent}%</p>
              </div>
            </div>
            <div className="mt-3 h-3 bg-muted rounded-full overflow-hidden flex">
              {reserveCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  className={cn(
                    "h-full",
                    index === 0 && "bg-[#345fe1]",
                    index === 1 && "bg-[#22c55e]",
                    index === 2 && "bg-[#f97316]",
                    index === 3 && "bg-[#a855f7]",
                  )}
                  style={{ width: `${(reserveSettings[cat.id] / totalReservePercent) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {reserveCategories.map((cat, index) => (
                <div key={cat.id} className="flex items-center gap-2 text-xs">
                  <div
                    className={cn(
                      "w-3 h-3 rounded",
                      index === 0 && "bg-[#345fe1]",
                      index === 1 && "bg-[#22c55e]",
                      index === 2 && "bg-[#f97316]",
                      index === 3 && "bg-[#a855f7]",
                    )}
                  />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderGantt = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            ガントチャート（カレンダー管理）
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth} className="bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-[120px] text-center">{monthName}</span>
            <Button variant="outline" size="icon" onClick={nextMonth} className="bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day headers */}
            <div className="flex border-b border-border">
              <div className="w-40 shrink-0 p-2 text-sm font-medium text-muted-foreground">イベント</div>
              <div className="flex-1 flex">
                {currentMonthDays.map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 min-w-[30px] p-1 text-center text-xs border-l border-border",
                      day.getDay() === 0 && "bg-red-50 text-red-600",
                      day.getDay() === 6 && "bg-blue-50 text-blue-600",
                    )}
                  >
                    {day.getDate()}
                  </div>
                ))}
              </div>
            </div>

            {/* Event rows */}
            {cashFlowData
              .filter((event) => {
                const eventMonth = new Date(event.date).getMonth()
                return eventMonth === currentMonth.getMonth()
              })
              .map((event) => {
                const startDay = new Date(event.date).getDate()
                const endDay = new Date(event.endDate).getDate()
                const duration = endDay - startDay + 1

                return (
                  <div key={event.id} className="flex border-b border-border/50 hover:bg-muted/30">
                    <div className="w-40 shrink-0 p-2 text-sm flex items-center gap-2">
                      {event.type === "income" ? (
                        <ArrowUpCircle className="w-4 h-4 text-[#345fe1]" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="truncate">{event.description}</span>
                    </div>
                    <div className="flex-1 flex items-center relative">
                      {currentMonthDays.map((_, i) => (
                        <div key={i} className="flex-1 min-w-[30px] h-8 border-l border-border/30" />
                      ))}
                      <div
                        className={cn(
                          "absolute h-6 rounded-md text-xs text-white flex items-center justify-center font-medium",
                          event.type === "income" ? "bg-[#345fe1]" : "bg-red-500",
                        )}
                        style={{
                          left: `${((startDay - 1) / currentMonthDays.length) * 100}%`,
                          width: `${(duration / currentMonthDays.length) * 100}%`,
                          minWidth: "30px",
                        }}
                      >
                        {formatCurrency(Math.abs(event.amount))}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#345fe1] rounded" />
            <span className="text-muted-foreground">入金</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-muted-foreground">出金</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{getPageTitle()}</h2>
        <p className="text-muted-foreground">{getPageDescription()}</p>
      </div>

      {/* Quick Stats - Only show on overview */}
      {initialTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#345fe1]/10 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#345fe1]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">総資産</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAssets)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#345fe1]/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-[#345fe1]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">内部留保合計</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(reserveAmount)}</p>
                  <p className="text-sm text-[#345fe1]">{totalReservePercent}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#345fe1] to-[#2a4bb3] text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/70">可処分予算</p>
                  <p className="text-2xl font-bold">{formatCurrency(disposableBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {initialTab === "overview" && renderOverview()}
      {initialTab === "reserve" && renderReserve()}
      {initialTab === "gantt" && renderGantt()}
    </div>
  )
}
