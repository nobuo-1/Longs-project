"use client"

import { useMemo, useState } from "react"
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Settings,
  Smartphone,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FinanceFlowProps {
  initialTab?: "overview" | "reserve" | "gantt"
}

type FlowType = "income" | "expense"

type RecurringSchedule = {
  id: string
  partner: string
  description: string
  amount: number
  type: FlowType
  category: string
  cycle: string
  offsetMonths: number
  day: number
  tags?: string[]
  seasonality?: number[]
  isFixed?: boolean
}

type FinanceEvent = {
  id: string
  scheduleId: string
  partner: string
  description: string
  amount: number
  type: FlowType
  category: string
  cycle: string
  dueDate: Date
  invoiceMonth: number
  tags?: string[]
  isFixed?: boolean
}

const totalAssets = 15000000 // 15 million yen

const recurringSchedules: RecurringSchedule[] = [
  {
    id: "client-south",
    partner: "南青山セレクト",
    description: "主要卸先（30日締め）",
    amount: 3200000,
    type: "income",
    category: "売掛入金",
    cycle: "当月末払い",
    offsetMonths: 0,
    day: 28,
    tags: ["当月払い", "主力"],
  },
  {
    id: "client-north",
    partner: "北陸百貨店",
    description: "百貨店PB",
    amount: 2100000,
    type: "income",
    category: "売掛入金",
    cycle: "翌月末払い",
    offsetMonths: 1,
    day: 30,
    tags: ["翌月末払い"],
  },
  {
    id: "client-kyushu",
    partner: "九州チェーン",
    description: "ロイヤリティ連動型",
    amount: 1650000,
    type: "income",
    category: "売掛入金",
    cycle: "翌々月15日払い",
    offsetMonths: 2,
    day: 15,
    tags: ["翌々月15日払い"],
  },
  {
    id: "client-ec",
    partner: "ECプラットフォーム",
    description: "カード決済入金",
    amount: 900000,
    type: "income",
    category: "EC入金",
    cycle: "当月15日払い",
    offsetMonths: 0,
    day: 15,
    tags: ["当月払い", "オンライン"],
  },
  {
    id: "client-others",
    partner: "その他取引先120社",
    description: "スポット/小口まとめ",
    amount: 2400000,
    type: "income",
    category: "売掛入金",
    cycle: "翌月25日払い",
    offsetMonths: 1,
    day: 25,
    tags: ["数百社集約"],
    seasonality: [1, 1.02, 0.95, 1.08, 1.1, 1.12, 1.2, 1.18, 1.05, 1, 0.96, 0.98],
  },
  {
    id: "supplier-osaka",
    partner: "大阪繊維",
    description: "生地仕入れ",
    amount: 1180000,
    type: "expense",
    category: "仕入支払い",
    cycle: "翌月15日払い",
    offsetMonths: 1,
    day: 15,
    tags: ["翌月支払い"],
  },
  {
    id: "supplier-kyoto",
    partner: "京都染工",
    description: "加工・染色",
    amount: 760000,
    type: "expense",
    category: "仕入支払い",
    cycle: "翌々月末払い",
    offsetMonths: 2,
    day: 30,
    tags: ["翌々月末払い"],
  },
  {
    id: "supplier-ship",
    partner: "東京物流パートナー",
    description: "物流・倉庫",
    amount: 430000,
    type: "expense",
    category: "物流/システム",
    cycle: "当月末払い",
    offsetMonths: 0,
    day: 25,
    tags: ["当月払い"],
  },
  {
    id: "supplier-factory",
    partner: "ベトナム工場A",
    description: "OEM仕入れ",
    amount: 1350000,
    type: "expense",
    category: "仕入支払い",
    cycle: "翌月末払い",
    offsetMonths: 1,
    day: 30,
    tags: ["海外"],
  },
]

const fixedCosts: RecurringSchedule[] = [
  {
    id: "fixed-rent",
    partner: "家賃・共益費",
    description: "本社+倉庫",
    amount: 850000,
    type: "expense",
    category: "固定費",
    cycle: "毎月1日",
    offsetMonths: 0,
    day: 1,
    tags: ["固定費"],
    isFixed: true,
  },
  {
    id: "fixed-payroll",
    partner: "人件費",
    description: "社員・アルバイト",
    amount: 1800000,
    type: "expense",
    category: "固定費",
    cycle: "毎月25日",
    offsetMonths: 0,
    day: 25,
    tags: ["給与", "固定費"],
    isFixed: true,
  },
  {
    id: "fixed-utility",
    partner: "水道光熱・通信",
    description: "公共料金/回線",
    amount: 240000,
    type: "expense",
    category: "固定費",
    cycle: "毎月10日",
    offsetMonths: 0,
    day: 10,
    tags: ["固定費"],
    isFixed: true,
  },
  {
    id: "fixed-ads",
    partner: "販促・広告枠",
    description: "媒体・SNS運用",
    amount: 450000,
    type: "expense",
    category: "販促費",
    cycle: "毎月20日",
    offsetMonths: 0,
    day: 20,
    tags: ["固定費"],
    isFixed: true,
  },
  {
    id: "fixed-saas",
    partner: "SaaS/システム",
    description: "EC/基幹/分析",
    amount: 220000,
    type: "expense",
    category: "システム",
    cycle: "毎月5日",
    offsetMonths: 0,
    day: 5,
    tags: ["固定費", "サブスク"],
    isFixed: true,
  },
]

const schedules: RecurringSchedule[] = [...recurringSchedules, ...fixedCosts]

const expandSchedules = (year: number): FinanceEvent[] => {
  const events: FinanceEvent[] = []

  for (let month = 0; month < 12; month++) {
    schedules.forEach((schedule) => {
      const dueMonth = month + schedule.offsetMonths
      const dueYear = year + Math.floor(dueMonth / 12)
      const normalizedMonth = ((dueMonth % 12) + 12) % 12

      if (dueYear !== year) {
        return
      }

      const seasonalFactor = schedule.seasonality?.[month] ?? 1
      const amount = Math.round(schedule.amount * seasonalFactor)

      events.push({
        id: `${schedule.id}-${year}-${normalizedMonth + 1}`,
        scheduleId: schedule.id,
        partner: schedule.partner,
        description: schedule.description,
        amount,
        type: schedule.type,
        category: schedule.category,
        cycle: schedule.cycle,
        dueDate: new Date(dueYear, normalizedMonth, schedule.day),
        invoiceMonth: month,
        tags: schedule.tags,
        isFixed: schedule.isFixed,
      })
    })
  }

  return events.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

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
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 3, 1))
  const [viewYear, setViewYear] = useState(2024)
  const [ganttMode, setGanttMode] = useState<"monthly" | "yearly">("monthly")
  const [selectedEvent, setSelectedEvent] = useState<FinanceEvent | null>(null)
  const [showSalesModal, setShowSalesModal] = useState(false)
  const [newSale, setNewSale] = useState({ partner: "", amount: 0, cycle: "当月末払い" })

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

  const monthName = currentMonth.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })
  const yearLabel = `${viewYear}年`

  const prevMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    setCurrentMonth(next)
    setViewYear(next.getFullYear())
  }

  const nextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    setCurrentMonth(next)
    setViewYear(next.getFullYear())
  }

  const changeYear = (delta: number) => {
    const nextYear = viewYear + delta
    setViewYear(nextYear)
    setCurrentMonth(new Date(nextYear, currentMonth.getMonth(), 1))
  }

  const yearlyEvents = useMemo(() => expandSchedules(viewYear), [viewYear])

  const monthlyEvents = useMemo(
    () => yearlyEvents.filter((event) => event.dueDate.getMonth() === currentMonth.getMonth()),
    [yearlyEvents, currentMonth],
  )

  const monthlyEventsSorted = useMemo(
    () => [...monthlyEvents].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [monthlyEvents],
  )

  const monthlyTotals = useMemo(
    () =>
      monthlyEvents.reduce(
        (acc, event) => {
          if (event.type === "income") {
            acc.income += event.amount
          } else {
            acc.expense += event.amount
            if (event.isFixed || event.category.includes("固定")) {
              acc.fixed += event.amount
            }
          }
          return acc
        },
        { income: 0, expense: 0, fixed: 0 },
      ),
    [monthlyEvents],
  )

  const yearlyTotals = useMemo(
    () =>
      yearlyEvents.reduce(
        (acc, event) => {
          if (event.type === "income") {
            acc.income += event.amount
          } else {
            acc.expense += event.amount
            if (event.isFixed || event.category.includes("固定")) {
              acc.fixed += event.amount
            }
          }
          return acc
        },
        { income: 0, expense: 0, fixed: 0 },
      ),
    [yearlyEvents],
  )

  const monthlySummary = useMemo(
    () =>
      Array.from({ length: 12 }, (_, month) => {
        const monthEvents = yearlyEvents.filter((event) => event.dueDate.getMonth() === month)
        const income = monthEvents.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
        const expense = monthEvents.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
        const fixed = monthEvents
          .filter((e) => e.isFixed || e.category.includes("固定"))
          .reduce((sum, e) => sum + e.amount, 0)

        return {
          month,
          income,
          expense,
          fixed,
          net: income - expense,
        }
      }),
    [yearlyEvents],
  )

  const cycleSummary = useMemo(() => {
    const summary: Record<string, { income: number; expense: number }> = {}
    monthlyEvents.forEach((event) => {
      if (!summary[event.cycle]) {
        summary[event.cycle] = { income: 0, expense: 0 }
      }
      if (event.type === "income") {
        summary[event.cycle].income += event.amount
      } else {
        summary[event.cycle].expense += event.amount
      }
    })
    return summary
  }, [monthlyEvents])

  const monthlyMaxAmount = monthlyEvents.length
    ? Math.max(...monthlyEvents.map((item) => Math.abs(item.amount)))
    : 1

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
        return "月次/年間ガントで振込サイト・固定費を一目管理"
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

  const spanMonths = (cycle: string) => {
    if (cycle.includes("翌々月")) return 3
    if (cycle.includes("翌月")) return 2
    return 1
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              当月キャッシュイン/アウトの流れ
            </CardTitle>
            <Badge variant="outline" className="bg-muted/40">
              {monthName}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            当月の入金・支払い・固定費をサイト付きでざっくり確認。詳細はガントチャートタブで展開できます。
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-24">日付</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-32">サイト</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">内容</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-24">カテゴリ</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-32">金額</th>
                  <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-64">タイムライン</th>
                </tr>
              </thead>
              <tbody>
                {monthlyEventsSorted.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {item.dueDate.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-white">
                        {item.cycle}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.type === "income" ? <ArrowUpCircle className="w-4 h-4 text-[#345fe1]" /> : <ArrowDownCircle className="w-4 h-4 text-red-500" />}
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.partner}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        {item.isFixed ? "固定費" : item.category}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "py-3 px-4 text-right text-sm font-medium",
                        item.type === "income" ? "text-[#345fe1]" : item.isFixed ? "text-amber-700" : "text-red-600",
                      )}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center h-6">
                        <div className="w-full bg-muted rounded-full h-2 relative">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              item.type === "income" ? "bg-[#345fe1]" : item.isFixed ? "bg-amber-500" : "bg-red-500",
                            )}
                            style={{
                              width: `${(Math.abs(item.amount) / monthlyMaxAmount) * 100}%`,
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
                  onValueChange={(value: number[]) => updateReserveSetting(cat.id, value[0])}
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

  const renderGantt = () => {
    const yearlyRows = schedules.map((schedule) => ({
      ...schedule,
      events: yearlyEvents.filter((event) => event.scheduleId === schedule.id),
    }))

    const monthlyLegend = (
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#345fe1]" />
          <span>入金</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>仕入・支払い</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span>固定費</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>横スクロールでスマホ確認</span>
        </div>
      </div>
    )

    const renderMonthly = () => (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth} className="bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm min-w-[120px] text-center">{monthName}</span>
            <Button variant="outline" size="icon" onClick={nextMonth} className="bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="bg-muted/40">
              サイト {Object.keys(cycleSummary).length} パターン
            </Badge>
            <Badge variant="outline" className="bg-muted/40">
              取引 {monthlyEvents.length} 件
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="bg-[#345fe1]/10 border-none">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">当月入金（売掛）</p>
              <p className="text-xl font-bold text-[#345fe1]">{formatCurrency(monthlyTotals.income)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">当月支払い</p>
              <p className="text-xl font-bold text-red-500">{formatCurrency(monthlyTotals.expense)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">固定費（PL）</p>
              <p className="text-xl font-bold text-amber-600">{formatCurrency(monthlyTotals.fixed)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#345fe1] to-[#2a4bb3] text-white">
            <CardContent className="pt-4">
              <p className="text-xs text-white/80">当月差引</p>
              <p className="text-xl font-bold">{formatCurrency(monthlyTotals.income - monthlyTotals.expense)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(cycleSummary).map(([cycle, value]) => (
            <Badge key={cycle} variant="outline" className="bg-muted/40">
              <span className="text-xs">{cycle}</span>
              <span className="text-[#345fe1] font-semibold">+{formatCurrency(value.income)}</span>
              <span className="text-red-500 font-semibold">-{formatCurrency(value.expense)}</span>
            </Badge>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-28">日付</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-32">サイト</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">取引先 / 内容</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-24">種別</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground w-32">金額</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-64">タイムライン</th>
              </tr>
            </thead>
            <tbody>
              {monthlyEventsSorted.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-border/70 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <td className="py-3 px-4 text-muted-foreground">
                    {event.dueDate.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="bg-white">
                      {event.cycle}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{event.partner}</span>
                      <span className="text-xs text-muted-foreground">{event.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        event.type === "income"
                          ? "bg-[#345fe1]/10 text-[#345fe1]"
                          : event.isFixed
                            ? "bg-amber-500/20 text-amber-700"
                            : "bg-red-500/10 text-red-600",
                      )}
                    >
                      {event.type === "income" ? "入金" : event.isFixed ? "固定費" : "支払い"}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4 text-right font-semibold",
                      event.type === "income" ? "text-[#345fe1]" : event.isFixed ? "text-amber-700" : "text-red-600",
                    )}
                  >
                    {event.type === "income" ? "+" : "-"}
                    {formatCurrency(event.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center h-6">
                      <div className="w-full bg-muted rounded-full h-2 relative">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            event.type === "income" ? "bg-[#345fe1]" : event.isFixed ? "bg-amber-500" : "bg-red-500",
                          )}
                          style={{
                            width: `${(Math.abs(event.amount) / monthlyMaxAmount) * 100}%`,
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

        {monthlyLegend}
      </div>
    )

    const renderYearly = () => (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => changeYear(-1)} className="bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm min-w-[120px] text-center">{yearLabel}</span>
            <Button variant="outline" size="icon" onClick={() => changeYear(1)} className="bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="bg-muted/40">
              主要取引先 {recurringSchedules.length} 件
            </Badge>
            <Badge variant="outline" className="bg-muted/40">
              固定費 {fixedCosts.length} 件
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-[#345fe1]/10 border-none">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">年間入金予定</p>
              <p className="text-xl font-bold text-[#345fe1]">{formatCurrency(yearlyTotals.income)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">年間支払い予定</p>
              <p className="text-xl font-bold text-red-500">{formatCurrency(yearlyTotals.expense)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">固定費合計</p>
              <p className="text-xl font-bold text-amber-600">{formatCurrency(yearlyTotals.fixed)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#345fe1] to-[#2a4bb3] text-white">
            <CardContent className="pt-4">
              <p className="text-xs text-white/80">年間差引</p>
              <p className="text-xl font-bold">{formatCurrency(yearlyTotals.income - yearlyTotals.expense)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {monthlySummary.map((item) => (
            <div key={item.month} className="p-3 rounded-xl border bg-muted/40">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.month + 1}月</span>
                <span>{formatCurrency(item.net)}</span>
              </div>
              <div className="mt-2 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[#345fe1]">
                  <span>入金</span>
                  <span className="font-semibold">{formatCurrency(item.income)}</span>
                </div>
                <div className="flex items-center justify-between text-red-500">
                  <span>支払い</span>
                  <span className="font-semibold">{formatCurrency(item.expense)}</span>
                </div>
                <div className="flex items-center justify-between text-amber-600">
                  <span>固定費</span>
                  <span className="font-semibold">{formatCurrency(item.fixed)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <div className="min-w-[1080px]">
            <div className="grid grid-cols-[200px_repeat(12,minmax(70px,1fr))] bg-muted/50 text-xs font-medium">
              <div className="p-3 text-left">取引先 / サイト</div>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="p-3 text-center">
                  {i + 1}月
                </div>
              ))}
            </div>

            {yearlyRows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[200px_repeat(12,minmax(70px,1fr))] border-t border-border/70"
              >
                <div className="p-3 space-y-1">
                  <div className="text-sm font-semibold text-foreground">{row.partner}</div>
                  <div className="text-xs text-muted-foreground">{row.cycle}</div>
                  <div className="text-xs text-muted-foreground">{row.description}</div>
                </div>
                {Array.from({ length: 12 }, (_, month) => {
                  const event = row.events.find((item) => item.dueDate.getMonth() === month)
                  const colorClass =
                    event?.type === "income" ? "bg-[#345fe1]" : row.isFixed ? "bg-amber-500" : "bg-red-500"
                  return (
                    <button
                      key={`${row.id}-${month}`}
                      onClick={() => event && setSelectedEvent(event)}
                      disabled={!event}
                      className={cn(
                        "min-h-[64px] p-1.5 text-left border-l border-border/40 hover:bg-muted/40 transition-colors",
                        !event && "bg-muted/20 text-muted-foreground cursor-default",
                      )}
                    >
                      {event ? (
                        <div className={cn("h-full rounded-lg px-2 py-1 text-white space-y-1", colorClass)}>
                          <div className="text-[11px] font-semibold leading-tight">{formatCurrency(event.amount)}</div>
                          <div className="text-[10px] leading-tight opacity-90">
                            {event.dueDate.getMonth() + 1} / {event.dueDate.getDate()} ｜ {event.cycle}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px]">-</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle className="text-sm">サイトスパン（翌月/翌々月払いは3か月帯表示）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {yearlyRows.map((row) => (
              <div key={row.id} className="flex items-center gap-3">
                <span className="text-xs w-28 truncate">{row.partner}</span>
                <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden relative">
                  {row.events.map((event) => {
                    const startMonth = event.invoiceMonth
                    const span = spanMonths(event.cycle)
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute top-1 h-6 rounded-full text-[10px] text-white px-2 flex items-center",
                          event.type === "income" ? "bg-[#345fe1]" : row.isFixed ? "bg-amber-500" : "bg-red-500",
                        )}
                        style={{
                          left: `${(startMonth / 12) * 100}%`,
                          width: `${(span / 12) * 100}%`,
                          minWidth: "6%",
                        }}
                      >
                        {event.cycle}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#345fe1]" />
            <span>入金サイト</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>仕入・支払いサイト</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span>固定費</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>年間カレンダーは横スクロール対応</span>
          </div>
        </div>
      </div>
    )

    return (
      <>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                ガントチャート（振込・支払いサイト）
              </CardTitle>
              <div className="flex gap-2">
                <Button variant={ganttMode === "monthly" ? "default" : "outline"} onClick={() => setGanttMode("monthly")}>
                  月次
                </Button>
                <Button variant={ganttMode === "yearly" ? "default" : "outline"} onClick={() => setGanttMode("yearly")}>
                  年間
                </Button>
                <Button variant="outline" onClick={() => setShowSalesModal(true)}>
                  売上登録
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              主要取引先と数百社の小口まとめ、固定費を含めて月次/年間で一目チェック。クリックで詳細も確認できます。
            </p>
          </CardHeader>
          <CardContent>{ganttMode === "monthly" ? renderMonthly() : renderYearly()}</CardContent>
        </Card>

        <Dialog open={!!selectedEvent} onOpenChange={(open: boolean) => !open && setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.partner}</DialogTitle>
              <DialogDescription>
                {selectedEvent?.cycle}｜{selectedEvent?.category}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs">入出金日</p>
                    <p className="font-semibold">
                      {selectedEvent.dueDate.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">請求月 / 種別</p>
                    <p className="font-semibold">
                      {selectedEvent.invoiceMonth + 1}月請求 ｜{" "}
                      {selectedEvent.type === "income" ? "入金" : selectedEvent.isFixed ? "固定費" : "支払い"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">金額</p>
                    <p
                      className={cn(
                        "text-lg font-bold",
                        selectedEvent.type === "income"
                          ? "text-[#345fe1]"
                          : selectedEvent.isFixed
                            ? "text-amber-700"
                            : "text-red-600",
                      )}
                    >
                      {selectedEvent.type === "income" ? "+" : "-"}
                      {formatCurrency(selectedEvent.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">区分</p>
                    <p className="font-semibold">{selectedEvent.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">メモ</p>
                  <p className="font-medium text-foreground">{selectedEvent.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedEvent.tags || []).map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-muted/40">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showSalesModal} onOpenChange={setShowSalesModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>売上登録（ダミー入力）</DialogTitle>
              <DialogDescription>請求先とサイト、入金予定を登録します。</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">請求先</p>
                <Input
                  placeholder="例）南青山セレクト"
                  value={newSale.partner}
                  onChange={(e) => setNewSale((prev) => ({ ...prev, partner: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">入金額</p>
                <Input
                  type="number"
                  value={newSale.amount}
                  onChange={(e) => setNewSale((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">サイト</p>
                <Select
                  value={newSale.cycle}
                  onValueChange={(v: string) => setNewSale((prev) => ({ ...prev, cycle: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="当月末払い">当月末払い</SelectItem>
                    <SelectItem value="翌月末払い">翌月末払い</SelectItem>
                    <SelectItem value="翌々月15日払い">翌々月15日払い</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowSalesModal(false)} className="w-full bg-[#345fe1] hover:bg-[#2a4bb3] text-white">
                保存（ダミー）
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

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
