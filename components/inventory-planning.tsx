"use client"

import { useState } from "react"
import { Download, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const planningData = {
  2024: [
    {
      month: "4月",
      purchaseBudget: 3500000,
      purchaseBudgetLastYear: 3200000,
      purchaseBudgetPrediction: 3600000,
      shipmentAmount: 4200000,
      shipmentAmountLastYear: 3800000,
      shipmentAmountPrediction: 4300000,
      shipmentGrossProfitRate: 32.5,
      shipmentGrossProfitRateLastYear: 30.5,
      shipmentGrossProfitRatePrediction: 33.0,
      shipmentCost: 2835000,
      shipmentCostLastYear: 2641000,
      shipmentCostPrediction: 2880000,
      waste: 85000,
      wasteLastYear: 78000,
      wastePrediction: 80000,
      monthEndInventory: 8500000,
      monthEndInventoryLastYear: 7800000,
      monthEndInventoryPrediction: 8600000,
      inventoryPlan: 8200000,
      planDiff: 300000,
      lastYearInventory: 7800000,
    },
    {
      month: "5月",
      purchaseBudget: 4200000,
      purchaseBudgetLastYear: 3800000,
      purchaseBudgetPrediction: 4300000,
      shipmentAmount: 5100000,
      shipmentAmountLastYear: 4600000,
      shipmentAmountPrediction: 5200000,
      shipmentGrossProfitRate: 34.2,
      shipmentGrossProfitRateLastYear: 32.0,
      shipmentGrossProfitRatePrediction: 34.5,
      shipmentCost: 3356000,
      shipmentCostLastYear: 3128000,
      shipmentCostPrediction: 3400000,
      waste: 92000,
      wasteLastYear: 85000,
      wastePrediction: 88000,
      monthEndInventory: 9100000,
      monthEndInventoryLastYear: 8500000,
      monthEndInventoryPrediction: 9200000,
      inventoryPlan: 9000000,
      planDiff: 100000,
      lastYearInventory: 8500000,
    },
    {
      month: "6月",
      purchaseBudget: 3800000,
      purchaseBudgetLastYear: 3500000,
      purchaseBudgetPrediction: 3900000,
      shipmentAmount: 4800000,
      shipmentAmountLastYear: 4300000,
      shipmentAmountPrediction: 4900000,
      shipmentGrossProfitRate: 33.8,
      shipmentGrossProfitRateLastYear: 31.5,
      shipmentGrossProfitRatePrediction: 34.0,
      shipmentCost: 3178000,
      shipmentCostLastYear: 2946000,
      shipmentCostPrediction: 3230000,
      waste: 78000,
      wasteLastYear: 72000,
      wastePrediction: 75000,
      monthEndInventory: 8700000,
      monthEndInventoryLastYear: 8200000,
      monthEndInventoryPrediction: 8800000,
      inventoryPlan: 8500000,
      planDiff: 200000,
      lastYearInventory: 8200000,
    },
    {
      month: "7月",
      purchaseBudget: 5500000,
      purchaseBudgetLastYear: 5000000,
      purchaseBudgetPrediction: 5600000,
      shipmentAmount: 6200000,
      shipmentAmountLastYear: 5800000,
      shipmentAmountPrediction: 6400000,
      shipmentGrossProfitRate: 35.0,
      shipmentGrossProfitRateLastYear: 33.0,
      shipmentGrossProfitRatePrediction: 35.5,
      shipmentCost: 4030000,
      shipmentCostLastYear: 3886000,
      shipmentCostPrediction: 4100000,
      waste: 105000,
      wasteLastYear: 98000,
      wastePrediction: 100000,
      monthEndInventory: 9500000,
      monthEndInventoryLastYear: 9000000,
      monthEndInventoryPrediction: 9700000,
      inventoryPlan: 9800000,
      planDiff: -300000,
      lastYearInventory: 9000000,
    },
    {
      month: "8月",
      purchaseBudget: 5800000,
      purchaseBudgetLastYear: 5300000,
      purchaseBudgetPrediction: 5900000,
      shipmentAmount: 6800000,
      shipmentAmountLastYear: 6200000,
      shipmentAmountPrediction: 7000000,
      shipmentGrossProfitRate: 36.2,
      shipmentGrossProfitRateLastYear: 34.0,
      shipmentGrossProfitRatePrediction: 36.5,
      shipmentCost: 4338000,
      shipmentCostLastYear: 4092000,
      shipmentCostPrediction: 4400000,
      waste: 115000,
      wasteLastYear: 108000,
      wastePrediction: 110000,
      monthEndInventory: 9200000,
      monthEndInventoryLastYear: 8800000,
      monthEndInventoryPrediction: 9400000,
      inventoryPlan: 9500000,
      planDiff: -300000,
      lastYearInventory: 8800000,
    },
    {
      month: "9月",
      purchaseBudget: 4500000,
      purchaseBudgetLastYear: 4200000,
      purchaseBudgetPrediction: 4600000,
      shipmentAmount: 5500000,
      shipmentAmountLastYear: 5000000,
      shipmentAmountPrediction: 5600000,
      shipmentGrossProfitRate: 34.5,
      shipmentGrossProfitRateLastYear: 32.5,
      shipmentGrossProfitRatePrediction: 35.0,
      shipmentCost: 3603000,
      shipmentCostLastYear: 3375000,
      shipmentCostPrediction: 3650000,
      waste: 88000,
      wasteLastYear: 82000,
      wastePrediction: 85000,
      monthEndInventory: 8800000,
      monthEndInventoryLastYear: 8400000,
      monthEndInventoryPrediction: 9000000,
      inventoryPlan: 8600000,
      planDiff: 200000,
      lastYearInventory: 8400000,
    },
    {
      month: "10月",
      purchaseBudget: 4800000,
      purchaseBudgetLastYear: 4500000,
      purchaseBudgetPrediction: 4900000,
      shipmentAmount: 5800000,
      shipmentAmountLastYear: 5400000,
      shipmentAmountPrediction: 6000000,
      shipmentGrossProfitRate: 33.2,
      shipmentGrossProfitRateLastYear: 31.8,
      shipmentGrossProfitRatePrediction: 33.5,
      shipmentCost: 3875000,
      shipmentCostLastYear: 3683000,
      shipmentCostPrediction: 3950000,
      waste: 95000,
      wasteLastYear: 88000,
      wastePrediction: 90000,
      monthEndInventory: 9200000,
      monthEndInventoryLastYear: 8700000,
      monthEndInventoryPrediction: 9400000,
      inventoryPlan: 9000000,
      planDiff: 200000,
      lastYearInventory: 8700000,
    },
    {
      month: "11月",
      purchaseBudget: 5200000,
      purchaseBudgetLastYear: 4800000,
      purchaseBudgetPrediction: 5300000,
      shipmentAmount: 6500000,
      shipmentAmountLastYear: 6000000,
      shipmentAmountPrediction: 6700000,
      shipmentGrossProfitRate: 35.5,
      shipmentGrossProfitRateLastYear: 33.5,
      shipmentGrossProfitRatePrediction: 36.0,
      shipmentCost: 4193000,
      shipmentCostLastYear: 3990000,
      shipmentCostPrediction: 4280000,
      waste: 102000,
      wasteLastYear: 95000,
      wastePrediction: 98000,
      monthEndInventory: 9600000,
      monthEndInventoryLastYear: 9200000,
      monthEndInventoryPrediction: 9800000,
      inventoryPlan: 9800000,
      planDiff: -200000,
      lastYearInventory: 9200000,
    },
    {
      month: "12月",
      purchaseBudget: 6500000,
      purchaseBudgetLastYear: 6000000,
      purchaseBudgetPrediction: 6700000,
      shipmentAmount: 8200000,
      shipmentAmountLastYear: 7500000,
      shipmentAmountPrediction: 8500000,
      shipmentGrossProfitRate: 38.0,
      shipmentGrossProfitRateLastYear: 36.0,
      shipmentGrossProfitRatePrediction: 38.5,
      shipmentCost: 5084000,
      shipmentCostLastYear: 4800000,
      shipmentCostPrediction: 5200000,
      waste: 135000,
      wasteLastYear: 125000,
      wastePrediction: 128000,
      monthEndInventory: 8500000,
      monthEndInventoryLastYear: 8000000,
      monthEndInventoryPrediction: 8700000,
      inventoryPlan: 8200000,
      planDiff: 300000,
      lastYearInventory: 8000000,
    },
    {
      month: "1月",
      purchaseBudget: 3200000,
      purchaseBudgetLastYear: 2900000,
      purchaseBudgetPrediction: 3300000,
      shipmentAmount: 3800000,
      shipmentAmountLastYear: 3500000,
      shipmentAmountPrediction: 3900000,
      shipmentGrossProfitRate: 31.5,
      shipmentGrossProfitRateLastYear: 29.5,
      shipmentGrossProfitRatePrediction: 32.0,
      shipmentCost: 2603000,
      shipmentCostLastYear: 2468000,
      shipmentCostPrediction: 2650000,
      waste: 72000,
      wasteLastYear: 65000,
      wastePrediction: 68000,
      monthEndInventory: 8200000,
      monthEndInventoryLastYear: 7600000,
      monthEndInventoryPrediction: 8400000,
      inventoryPlan: 8000000,
      planDiff: 200000,
      lastYearInventory: 7600000,
    },
    {
      month: "2月",
      purchaseBudget: 3000000,
      purchaseBudgetLastYear: 2700000,
      purchaseBudgetPrediction: 3100000,
      shipmentAmount: 3500000,
      shipmentAmountLastYear: 3200000,
      shipmentAmountPrediction: 3600000,
      shipmentGrossProfitRate: 30.8,
      shipmentGrossProfitRateLastYear: 28.8,
      shipmentGrossProfitRatePrediction: 31.0,
      shipmentCost: 2422000,
      shipmentCostLastYear: 2278000,
      shipmentCostPrediction: 2480000,
      waste: 68000,
      wasteLastYear: 62000,
      wastePrediction: 65000,
      monthEndInventory: 7900000,
      monthEndInventoryLastYear: 7400000,
      monthEndInventoryPrediction: 8100000,
      inventoryPlan: 7800000,
      planDiff: 100000,
      lastYearInventory: 7400000,
    },
    {
      month: "3月",
      purchaseBudget: 4000000,
      purchaseBudgetLastYear: 3600000,
      purchaseBudgetPrediction: 4100000,
      shipmentAmount: 4500000,
      shipmentAmountLastYear: 4100000,
      shipmentAmountPrediction: 4600000,
      shipmentGrossProfitRate: 32.0,
      shipmentGrossProfitRateLastYear: 30.2,
      shipmentGrossProfitRatePrediction: 32.5,
      shipmentCost: 3060000,
      shipmentCostLastYear: 2862000,
      shipmentCostPrediction: 3100000,
      waste: 82000,
      wasteLastYear: 75000,
      wastePrediction: 78000,
      monthEndInventory: 8400000,
      monthEndInventoryLastYear: 7900000,
      monthEndInventoryPrediction: 8600000,
      inventoryPlan: 8200000,
      planDiff: 200000,
      lastYearInventory: 7900000,
    },
  ],
  2023: [
    {
      month: "4月",
      purchaseBudget: 3200000,
      purchaseBudgetLastYear: 2900000,
      purchaseBudgetPrediction: 3300000,
      shipmentAmount: 3800000,
      shipmentAmountLastYear: 3400000,
      shipmentAmountPrediction: 3900000,
      shipmentGrossProfitRate: 30.5,
      shipmentGrossProfitRateLastYear: 28.5,
      shipmentGrossProfitRatePrediction: 31.0,
      shipmentCost: 2641000,
      shipmentCostLastYear: 2430000,
      shipmentCostPrediction: 2700000,
      waste: 78000,
      wasteLastYear: 72000,
      wastePrediction: 75000,
      monthEndInventory: 7800000,
      monthEndInventoryLastYear: 7200000,
      monthEndInventoryPrediction: 8000000,
      inventoryPlan: 7500000,
      planDiff: 300000,
      lastYearInventory: 7200000,
    },
    // ... more months for 2023
    {
      month: "5月",
      purchaseBudget: 3800000,
      purchaseBudgetLastYear: 3500000,
      purchaseBudgetPrediction: 3900000,
      shipmentAmount: 4600000,
      shipmentAmountLastYear: 4200000,
      shipmentAmountPrediction: 4700000,
      shipmentGrossProfitRate: 32.0,
      shipmentGrossProfitRateLastYear: 30.0,
      shipmentGrossProfitRatePrediction: 32.5,
      shipmentCost: 3128000,
      shipmentCostLastYear: 2940000,
      shipmentCostPrediction: 3200000,
      waste: 85000,
      wasteLastYear: 80000,
      wastePrediction: 82000,
      monthEndInventory: 8500000,
      monthEndInventoryLastYear: 7800000,
      monthEndInventoryPrediction: 8700000,
      inventoryPlan: 8300000,
      planDiff: 200000,
      lastYearInventory: 7800000,
    },
  ],
}

export function InventoryPlanning() {
  const [selectedYear, setSelectedYear] = useState<"2024" | "2023">("2024")
  const [showComparison, setShowComparison] = useState(true)
  const [planInput, setPlanInput] = useState({
    month: "2024-12",
    purchaseBudget: 4200000,
    shipmentAmount: 5200000,
    grossProfitRate: 34.5,
    notes: "冬物と春物の谷間で広告を抑制",
  })

  const data = planningData[selectedYear]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return `¥${(value / 1000000).toFixed(1)}M`
    }
    return `¥${(value / 1000).toFixed(0)}K`
  }

  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  // Calculate totals
  const totals = data.reduce(
    (acc, item) => ({
      purchaseBudget: acc.purchaseBudget + item.purchaseBudget,
      shipmentAmount: acc.shipmentAmount + item.shipmentAmount,
      shipmentCost: acc.shipmentCost + item.shipmentCost,
      waste: acc.waste + item.waste,
    }),
    { purchaseBudget: 0, shipmentAmount: 0, shipmentCost: 0, waste: 0 },
  )

  const avgGrossProfitRate = data.reduce((acc, item) => acc + item.shipmentGrossProfitRate, 0) / data.length

  const avgMonthEndInventory = data.reduce((acc, item) => acc + item.monthEndInventory, 0) / data.length
  const totalPlanDiff = data.reduce((acc, item) => acc + item.planDiff, 0)

  const renderCellWithComparison = (
    value: number,
    lastYear: number,
    prediction: number,
    isCurrency = true,
    isPercent = false,
  ) => {
    const format = isPercent ? formatPercent : isCurrency ? formatCurrency : (v: number) => v.toString()
    return (
      <div className="text-right">
        <div className="font-mono font-medium">{format(value)}</div>
        {showComparison && (
          <div className="text-[10px] text-muted-foreground/60 mt-0.5">
            <span className="text-gray-400">昨年: {format(lastYear)}</span>
            <span className="mx-1">|</span>
            <span className="text-[#345fe1]/50">予測: {format(prediction)}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">在庫計画早見表</h2>
        <p className="text-muted-foreground">月次の在庫計画と実績の比較</p>
      </div>

      {/* Year Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-muted-foreground mb-1 block">年度</label>
                <Select value={selectedYear} onValueChange={(v) => setSelectedYear(v as "2024" | "2023")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024年度</SelectItem>
                    <SelectItem value="2023">2023年度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedYear(selectedYear === "2024" ? "2023" : "2024")}
                  className="bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedYear(selectedYear === "2023" ? "2024" : "2023")}
                  className="bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant={showComparison ? "default" : "outline"}
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                className={cn(showComparison ? "bg-[#345fe1] hover:bg-[#2a4bb3] text-white" : "bg-transparent")}
              >
                {showComparison ? "比較表示 ON" : "比較表示 OFF"}
              </Button>
            </div>
            <Button variant="outline" className="bg-transparent text-[#345fe1] border-[#345fe1]">
              <Download className="w-4 h-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">計画入力（ダミー）</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>対象月</Label>
            <Input
              type="month"
              value={planInput.month}
              onChange={(e) => setPlanInput((prev) => ({ ...prev, month: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>仕入予算</Label>
            <Input
              type="number"
              value={planInput.purchaseBudget}
              onChange={(e) => setPlanInput((prev) => ({ ...prev, purchaseBudget: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>出荷金額</Label>
            <Input
              type="number"
              value={planInput.shipmentAmount}
              onChange={(e) => setPlanInput((prev) => ({ ...prev, shipmentAmount: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>目標粗利率(%)</Label>
            <Input
              type="number"
              step="0.1"
              value={planInput.grossProfitRate}
              onChange={(e) => setPlanInput((prev) => ({ ...prev, grossProfitRate: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>メモ</Label>
            <Input
              value={planInput.notes}
              onChange={(e) => setPlanInput((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="例) 冬物重点・広告抑制など"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" type="button">
              仮登録
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                setPlanInput({ month: "", purchaseBudget: 0, shipmentAmount: 0, grossProfitRate: 0, notes: "" })
              }
            >
              クリア
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-[#345fe1] to-[#2a4bb3] text-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70">年間仕入れ予算</p>
                <p className="text-lg font-bold">{formatCurrencyShort(totals.purchaseBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">年間出荷金額</p>
                <p className="text-lg font-bold text-foreground">{formatCurrencyShort(totals.shipmentAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">平均在庫金額</p>
                <p className="text-lg font-bold text-foreground">{formatCurrencyShort(avgMonthEndInventory)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  totalPlanDiff >= 0 ? "bg-green-100" : "bg-red-100",
                )}
              >
                {totalPlanDiff >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">年間計画差</p>
                <p className={cn("text-lg font-bold", totalPlanDiff >= 0 ? "text-green-600" : "text-red-600")}>
                  {totalPlanDiff >= 0 ? "+" : ""}
                  {formatCurrencyShort(totalPlanDiff)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showComparison && (
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium">凡例:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-foreground" />
                <span>今年実績</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-400" />
                <span className="text-muted-foreground">昨年実績</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#345fe1]/50" />
                <span className="text-[#345fe1]">AI予測値</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planning Table - Improved with comparison data */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">{selectedYear}年度 在庫計画早見表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#345fe1]">
                  <th className="text-left py-4 px-4 text-white font-semibold sticky left-0 z-10 bg-[#345fe1] min-w-[160px]">
                    項目
                  </th>
                  {data.map((item) => (
                    <th key={item.month} className="text-center py-4 px-3 text-white font-semibold min-w-[120px]">
                      {item.month}
                    </th>
                  ))}
                  <th className="text-center py-4 px-4 bg-[#2a4bb3] text-white font-bold min-w-[140px]">合計/平均</th>
                </tr>
              </thead>
              <tbody>
                {/* Purchase Budget Row */}
                <tr className="border-b border-border hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-white sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#345fe1]" />
                      仕入れ予算
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3">
                      {renderCellWithComparison(
                        item.purchaseBudget,
                        item.purchaseBudgetLastYear,
                        item.purchaseBudgetPrediction,
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">
                    {formatCurrency(totals.purchaseBudget)}
                  </td>
                </tr>

                {/* Shipment Amount Row */}
                <tr className="border-b border-border bg-muted/20 hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-muted/20 sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      出荷金額
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3">
                      {renderCellWithComparison(
                        item.shipmentAmount,
                        item.shipmentAmountLastYear,
                        item.shipmentAmountPrediction,
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">
                    {formatCurrency(totals.shipmentAmount)}
                  </td>
                </tr>

                {/* Shipment Gross Profit Rate Row */}
                <tr className="border-b border-border hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-white sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      出荷粗利益率
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3">
                      <div className="text-right">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            item.shipmentGrossProfitRate >= 35
                              ? "bg-green-100 text-green-700"
                              : item.shipmentGrossProfitRate < 30
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700",
                          )}
                        >
                          {formatPercent(item.shipmentGrossProfitRate)}
                        </span>
                        {showComparison && (
                          <div className="text-[10px] text-muted-foreground/60 mt-1">
                            <span className="text-gray-400">{formatPercent(item.shipmentGrossProfitRateLastYear)}</span>
                            <span className="mx-1">|</span>
                            <span className="text-[#345fe1]/50">
                              {formatPercent(item.shipmentGrossProfitRatePrediction)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#345fe1]/10 text-[#345fe1]">
                      {formatPercent(avgGrossProfitRate)}
                    </span>
                  </td>
                </tr>

                {/* Shipment Cost Row */}
                <tr className="border-b border-border bg-muted/20 hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-muted/20 sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      出荷原価
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3">
                      {renderCellWithComparison(
                        item.shipmentCost,
                        item.shipmentCostLastYear,
                        item.shipmentCostPrediction,
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">
                    {formatCurrency(totals.shipmentCost)}
                  </td>
                </tr>

                {/* Waste Row */}
                <tr className="border-b border-border hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-white sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      廃品
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3">
                      <div className="text-right text-red-600">
                        <div className="font-mono font-medium">{formatCurrency(item.waste)}</div>
                        {showComparison && (
                          <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                            <span className="text-gray-400">{formatCurrency(item.wasteLastYear)}</span>
                            <span className="mx-1">|</span>
                            <span className="text-[#345fe1]/50">{formatCurrency(item.wastePrediction)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border text-red-600">
                    {formatCurrency(totals.waste)}
                  </td>
                </tr>

                {/* Month End Inventory Row */}
                <tr className="border-b border-border bg-muted/20 hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-muted/20 sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      月末在庫金額
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3">
                      {renderCellWithComparison(
                        item.monthEndInventory,
                        item.monthEndInventoryLastYear,
                        item.monthEndInventoryPrediction,
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">
                    {formatCurrencyShort(avgMonthEndInventory)}
                    <span className="text-xs text-muted-foreground font-normal ml-1">(平均)</span>
                  </td>
                </tr>

                {/* Inventory Plan Row */}
                <tr className="border-b border-border hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-white sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      在庫計画
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3 text-right font-mono">
                      {formatCurrency(item.inventoryPlan)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">-</td>
                </tr>

                {/* Plan Diff Row */}
                <tr className="border-b border-border bg-muted/20 hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-muted/20 sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      計画差
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3 text-right font-mono">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          item.planDiff > 0
                            ? "bg-green-100 text-green-700"
                            : item.planDiff < 0
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700",
                        )}
                      >
                        {item.planDiff >= 0 ? "+" : ""}
                        {formatCurrencyShort(item.planDiff)}
                      </span>
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        totalPlanDiff > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                      )}
                    >
                      {totalPlanDiff >= 0 ? "+" : ""}
                      {formatCurrencyShort(totalPlanDiff)}
                    </span>
                  </td>
                </tr>

                {/* Last Year Inventory Row */}
                <tr className="hover:bg-[#345fe1]/5 transition-colors">
                  <td className="py-4 px-4 font-medium bg-white sticky left-0 z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      昨年在庫実績
                    </div>
                  </td>
                  {data.map((item) => (
                    <td key={item.month} className="py-3 px-3 text-right font-mono text-muted-foreground">
                      {formatCurrency(item.lastYearInventory)}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold font-mono bg-muted/50 border-l border-border text-muted-foreground">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
