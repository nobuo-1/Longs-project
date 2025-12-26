"use client"

import { useMemo, useState } from "react"
import { Search, Download, BarChart3, Wallet, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ColumnDef = {
  key: string
  label: string
  align?: "right"
}

type DataView = {
  key: "sales" | "payables" | "receivables"
  label: string
  description: string
  columns: ColumnDef[]
  data: Array<Record<string, string | number>>
  totals?: { label: string; key: string; prefix?: string }[]
}

const dataViews: DataView[] = [
  {
    key: "sales",
    label: "売上・粗利 (得意先/ブランド軸)",
    description: "得意先分類・ブランド・アイテム軸で純売上数量から粗利率まで確認",
    columns: [
      { key: "得意先分類1名", label: "得意先分類1名" },
      { key: "ブランド名", label: "ブランド名" },
      { key: "アイテム名", label: "アイテム名" },
      { key: "商品名1", label: "商品名1" },
      { key: "担当者名", label: "担当者" },
      { key: "実績年月", label: "実績年月" },
      { key: "純売上数量", label: "純売上数量", align: "right" },
      { key: "純売上金額", label: "純売上金額", align: "right" },
      { key: "粗利金額", label: "粗利金額", align: "right" },
      { key: "粗利率", label: "粗利率(%)", align: "right" },
    ],
    data: [
      {
        得意先分類1名: "セレクトA",
        ブランド名: "UrbanLine",
        アイテム名: "トップス",
        商品名1: "コットンTシャツ",
        担当者名: "佐藤",
        実績年月: "2024-04",
        純売上数量: 340,
        純売上金額: 1320000,
        粗利金額: 462000,
        粗利率: 35.0,
      },
      {
        得意先分類1名: "百貨店B",
        ブランド名: "LuxeCoat",
        アイテム名: "アウター",
        商品名1: "ウールコート",
        担当者名: "山本",
        実績年月: "2024-04",
        純売上数量: 120,
        純売上金額: 2980000,
        粗利金額: 894000,
        粗利率: 30.0,
      },
      {
        得意先分類1名: "ECモール",
        ブランド名: "BasicWear",
        アイテム名: "トップス",
        商品名1: "リブタンク",
        担当者名: "田中",
        実績年月: "2024-04",
        純売上数量: 520,
        純売上金額: 980000,
        粗利金額: 343000,
        粗利率: 35.0,
      },
      {
        得意先分類1名: "専門店C",
        ブランド名: "DenimCo",
        アイテム名: "ボトムス",
        商品名1: "デニムパンツ",
        担当者名: "森",
        実績年月: "2024-04",
        純売上数量: 210,
        純売上金額: 890000,
        粗利金額: 267000,
        粗利率: 30.0,
      },
    ],
    totals: [
      { label: "純売上金額合計", key: "純売上金額", prefix: "¥" },
      { label: "粗利金額合計", key: "粗利金額", prefix: "¥" },
    ],
  },
  {
    key: "payables",
    label: "仕入・支払 (支払先別)",
    description: "支払先別に支払額・税込仕入・当月末残高を把握",
    columns: [
      { key: "支払先略称", label: "支払先" },
      { key: "前月末残高", label: "前月末残高", align: "right" },
      { key: "支払額", label: "支払額", align: "right" },
      { key: "純仕入金額", label: "純仕入金額", align: "right" },
      { key: "税込仕入金額", label: "税込仕入金額", align: "right" },
      { key: "当月末残高", label: "当月末残高", align: "right" },
    ],
    data: [
      {
        支払先略称: "大阪繊維",
        前月末残高: 820000,
        支払額: 1180000,
        純仕入金額: 1250000,
        税込仕入金額: 1375000,
        当月末残高: 940000,
      },
      {
        支払先略称: "京都染工",
        前月末残高: 540000,
        支払額: 760000,
        純仕入金額: 820000,
        税込仕入金額: 902000,
        当月末残高: 600000,
      },
      {
        支払先略称: "東京物流",
        前月末残高: 220000,
        支払額: 430000,
        純仕入金額: 450000,
        税込仕入金額: 495000,
        当月末残高: 240000,
      },
      {
        支払先略称: "ベトナム工場A",
        前月末残高: 980000,
        支払額: 1350000,
        純仕入金額: 1400000,
        税込仕入金額: 1540000,
        当月末残高: 1030000,
      },
    ],
    totals: [
      { label: "支払額合計", key: "支払額", prefix: "¥" },
      { label: "税込仕入金額合計", key: "税込仕入金額", prefix: "¥" },
    ],
  },
  {
    key: "receivables",
    label: "請求・入金 (請求先別)",
    description: "請求先別に入金額・税込売上・残高・与信を確認",
    columns: [
      { key: "請求先略称", label: "請求先" },
      { key: "担当者", label: "担当者" },
      { key: "入金額", label: "入金額", align: "right" },
      { key: "純売上金額", label: "純売上金額", align: "right" },
      { key: "税込売上金額", label: "税込売上金額", align: "right" },
      { key: "当月末残高", label: "当月末残高", align: "right" },
      { key: "与信枠残高", label: "与信枠残高", align: "right" },
    ],
    data: [
      {
        請求先略称: "南青山セレクト",
        担当者: "佐藤",
        入金額: 3200000,
        純売上金額: 3450000,
        税込売上金額: 3795000,
        当月末残高: 210000,
        与信枠残高: 1800000,
      },
      {
        請求先略称: "北陸百貨店",
        担当者: "田中",
        入金額: 2100000,
        純売上金額: 2280000,
        税込売上金額: 2508000,
        当月末残高: 420000,
        与信枠残高: 1300000,
      },
      {
        請求先略称: "九州チェーン",
        担当者: "山本",
        入金額: 1650000,
        純売上金額: 1760000,
        税込売上金額: 1936000,
        当月末残高: 320000,
        与信枠残高: 900000,
      },
      {
        請求先略称: "ECプラットフォーム",
        担当者: "森",
        入金額: 900000,
        純売上金額: 950000,
        税込売上金額: 1045000,
        当月末残高: 60000,
        与信枠残高: 700000,
      },
    ],
    totals: [
      { label: "入金額合計", key: "入金額", prefix: "¥" },
      { label: "税込売上金額合計", key: "税込売上金額", prefix: "¥" },
    ],
  },
]

const formatNumber = (value: number, isPercent = false) =>
  isPercent ? `${value.toFixed(1)}%` : new Intl.NumberFormat("ja-JP").format(value)

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeView, setActiveView] = useState<DataView["key"]>("sales")

  const currentView = dataViews.find((v) => v.key === activeView) || dataViews[0]

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()
    if (!query) return currentView.data
    return currentView.data.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [currentView, searchQuery])

  const sumByKey = (key: string) =>
    filteredData.reduce((acc, row) => acc + (typeof row[key] === "number" ? (row[key] as number) : 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Inventory AI</p>
          <h2 className="text-2xl font-bold text-foreground">在庫AIデータハブ</h2>
          <p className="text-muted-foreground text-sm">
            取得カラムに合わせて売上・仕入・請求を切り替え。店舗/ブランドの粒度でダミーデータを確認できます。
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          CSV出力（ダミー）
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">売上/粗利カラム</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-[#345fe1]" />
            <div>
              <p className="font-semibold text-lg">{formatNumber(sumByKey("純売上金額"))} 円</p>
              <p className="text-xs text-muted-foreground">純売上金額合計 (view: 売上・粗利)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">仕入/支払カラム</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center gap-3">
            <Wallet className="w-10 h-10 text-[#345fe1]" />
            <div>
              <p className="font-semibold text-lg">{formatNumber(sumByKey("支払額"))} 円</p>
              <p className="text-xs text-muted-foreground">支払額合計 (view: 仕入・支払)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">請求/入金カラム</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center gap-3">
            <Building2 className="w-10 h-10 text-[#345fe1]" />
            <div>
              <p className="font-semibold text-lg">{formatNumber(sumByKey("入金額"))} 円</p>
              <p className="text-xs text-muted-foreground">入金額合計 (view: 請求・入金)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <CardTitle className="text-base">{currentView.label}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentView.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {dataViews.map((view) => (
              <Button
                key={view.key}
                variant={view.key === activeView ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView(view.key)}
              >
                {view.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="得意先 / ブランド / 支払先 / 請求先 で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {currentView.columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="border-t border-border/70 hover:bg-muted/40">
                    {currentView.columns.map((col) => {
                      const value = row[col.key]
                      const isPercent = typeof value === "number" && col.label.includes("%")
                      const isCurrency = typeof value === "number" && !isPercent
                      return (
                        <td
                          key={`${col.key}-${idx}`}
                          className={cn("px-4 py-2.5 whitespace-nowrap", col.align === "right" && "text-right")}
                        >
                          {typeof value === "number"
                            ? isPercent
                              ? formatNumber(value, true)
                              : `¥${formatNumber(value)}`
                            : value}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentView.totals && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentView.totals.map((total) => (
                <Card key={total.key} className="bg-muted/40">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">{total.label}</p>
                    <p className="text-lg font-bold">
                      {total.prefix}
                      {formatNumber(sumByKey(total.key))}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
