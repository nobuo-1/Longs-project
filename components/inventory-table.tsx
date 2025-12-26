"use client"

import { useState, useMemo } from "react"
import { Search, Download, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const inventoryTableData = [
  {
    customerCode: "C001",
    department: "渋谷店",
    customerName: "山田商事",
    productCode: "SKU001",
    productName: "春物ジャケット（ネイビー）",
    netSales: 1580000,
    compositionRatio: 12.5,
    grossProfit: 474000,
    grossProfitRate: 30.0,
    cost: 11060,
    totalCost: 1106000,
    profit: 474000,
  },
  {
    customerCode: "C002",
    department: "新宿店",
    customerName: "田中物産",
    productCode: "SKU002",
    productName: "コットンTシャツ（白）",
    netSales: 796000,
    compositionRatio: 6.3,
    grossProfit: 318400,
    grossProfitRate: 40.0,
    cost: 2388,
    totalCost: 477600,
    profit: 318400,
  },
  {
    customerCode: "C003",
    department: "銀座店",
    customerName: "佐藤百貨",
    productCode: "SKU003",
    productName: "デニムパンツ（ブルー）",
    netSales: 890000,
    compositionRatio: 7.0,
    grossProfit: 267000,
    grossProfitRate: 30.0,
    cost: 6230,
    totalCost: 623000,
    profit: 267000,
  },
  {
    customerCode: "C001",
    department: "渋谷店",
    customerName: "山田商事",
    productCode: "SKU004",
    productName: "リネンシャツ（ベージュ）",
    netSales: 680000,
    compositionRatio: 5.4,
    grossProfit: 238000,
    grossProfitRate: 35.0,
    cost: 4420,
    totalCost: 442000,
    profit: 238000,
  },
  {
    customerCode: "C004",
    department: "横浜店",
    customerName: "鈴木貿易",
    productCode: "SKU005",
    productName: "ウールコート（グレー）",
    netSales: 2980000,
    compositionRatio: 23.5,
    grossProfit: 894000,
    grossProfitRate: 30.0,
    cost: 20860,
    totalCost: 2086000,
    profit: 894000,
  },
  {
    customerCode: "C002",
    department: "新宿店",
    customerName: "田中物産",
    productCode: "SKU006",
    productName: "スニーカー（白）",
    netSales: 1280000,
    compositionRatio: 10.1,
    grossProfit: 448000,
    grossProfitRate: 35.0,
    cost: 8320,
    totalCost: 832000,
    profit: 448000,
  },
  {
    customerCode: "C003",
    department: "銀座店",
    customerName: "佐藤百貨",
    productCode: "SKU007",
    productName: "レザーベルト（茶）",
    netSales: 450000,
    compositionRatio: 3.6,
    grossProfit: 180000,
    grossProfitRate: 40.0,
    cost: 2700,
    totalCost: 270000,
    profit: 180000,
  },
  {
    customerCode: "C005",
    department: "池袋店",
    customerName: "伊藤商会",
    productCode: "SKU008",
    productName: "カシミアニット（グレー）",
    netSales: 1850000,
    compositionRatio: 14.6,
    grossProfit: 555000,
    grossProfitRate: 30.0,
    cost: 12950,
    totalCost: 1295000,
    profit: 555000,
  },
  {
    customerCode: "C001",
    department: "渋谷店",
    customerName: "山田商事",
    productCode: "SKU009",
    productName: "チノパンツ（ベージュ）",
    netSales: 540000,
    compositionRatio: 4.3,
    grossProfit: 189000,
    grossProfitRate: 35.0,
    cost: 3510,
    totalCost: 351000,
    profit: 189000,
  },
  {
    customerCode: "C004",
    department: "横浜店",
    customerName: "鈴木貿易",
    productCode: "SKU010",
    productName: "ポロシャツ（白）",
    netSales: 420000,
    compositionRatio: 3.3,
    grossProfit: 168000,
    grossProfitRate: 40.0,
    cost: 2520,
    totalCost: 252000,
    profit: 168000,
  },
  {
    customerCode: "C002",
    department: "新宿店",
    customerName: "田中物産",
    productCode: "SKU011",
    productName: "スラックス（ネイビー）",
    netSales: 720000,
    compositionRatio: 5.7,
    grossProfit: 252000,
    grossProfitRate: 35.0,
    cost: 4680,
    totalCost: 468000,
    profit: 252000,
  },
  {
    customerCode: "C005",
    department: "池袋店",
    customerName: "伊藤商会",
    productCode: "SKU012",
    productName: "ブルゾン（カーキ）",
    netSales: 980000,
    compositionRatio: 7.7,
    grossProfit: 343000,
    grossProfitRate: 35.0,
    cost: 6370,
    totalCost: 637000,
    profit: 343000,
  },
]

type SortKey = keyof (typeof inventoryTableData)[0]
type SortOrder = "asc" | "desc"

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>("customerCode")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAndSortedData = useMemo(() => {
    let data = [...inventoryTableData]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.customerCode.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.productCode.toLowerCase().includes(query) ||
          item.productName.toLowerCase().includes(query),
      )
    }

    // Filter by department
    if (departmentFilter !== "all") {
      data = data.filter((item) => item.department === departmentFilter)
    }

    // Sort
    data.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortOrder === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })

    return data
  }, [searchQuery, departmentFilter, sortKey, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  const departments = [...new Set(inventoryTableData.map((d) => d.department))]

  // Calculate totals
  const totals = useMemo(() => {
    return filteredAndSortedData.reduce(
      (acc, item) => ({
        netSales: acc.netSales + item.netSales,
        grossProfit: acc.grossProfit + item.grossProfit,
        totalCost: acc.totalCost + item.totalCost,
        profit: acc.profit + item.profit,
      }),
      { netSales: 0, grossProfit: 0, totalCost: 0, profit: 0 },
    )
  }, [filteredAndSortedData])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">在庫一覧表</h2>
        <p className="text-muted-foreground">Excel形式の詳細在庫データ</p>
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
                  placeholder="得意先コード、商品名など..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">部門</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="部門を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部門</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              詳細フィルター
            </Button>
            <Button variant="outline" className="bg-transparent text-[#345fe1] border-[#345fe1]">
              <Download className="w-4 h-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">在庫データ（{filteredAndSortedData.length}件）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#345fe1]/20 bg-[#345fe1]/5">
                  {[
                    { key: "customerCode", label: "得意先コード" },
                    { key: "department", label: "部門" },
                    { key: "customerName", label: "得意先名" },
                    { key: "productCode", label: "商品コード" },
                    { key: "productName", label: "商品名" },
                    { key: "netSales", label: "純売上" },
                    { key: "compositionRatio", label: "構成比" },
                    { key: "grossProfit", label: "粗利益" },
                    { key: "grossProfitRate", label: "粗利益率" },
                    { key: "cost", label: "原価" },
                    { key: "totalCost", label: "原価合計" },
                    { key: "profit", label: "利益" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as SortKey)}
                      className="text-left py-3 px-3 text-xs font-semibold text-[#345fe1] cursor-pointer hover:bg-[#345fe1]/10 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, idx) => (
                  <tr
                    key={`${item.customerCode}-${item.productCode}-${idx}`}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/50 transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-muted/20",
                    )}
                  >
                    <td className="py-2.5 px-3 font-mono text-xs">{item.customerCode}</td>
                    <td className="py-2.5 px-3">{item.department}</td>
                    <td className="py-2.5 px-3 font-medium">{item.customerName}</td>
                    <td className="py-2.5 px-3 font-mono text-xs">{item.productCode}</td>
                    <td className="py-2.5 px-3">{item.productName}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(item.netSales)}</td>
                    <td className="py-2.5 px-3 text-right">{formatPercent(item.compositionRatio)}</td>
                    <td className="py-2.5 px-3 text-right text-green-600 font-medium">
                      {formatCurrency(item.grossProfit)}
                    </td>
                    <td className="py-2.5 px-3 text-right">{formatPercent(item.grossProfitRate)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(item.cost)}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">{formatCurrency(item.totalCost)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#345fe1]">{formatCurrency(item.profit)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#345fe1]/30 bg-[#345fe1]/5 font-bold">
                  <td colSpan={5} className="py-3 px-3 text-right">
                    合計
                  </td>
                  <td className="py-3 px-3 text-right">{formatCurrency(totals.netSales)}</td>
                  <td className="py-3 px-3 text-right">100%</td>
                  <td className="py-3 px-3 text-right text-green-600">{formatCurrency(totals.grossProfit)}</td>
                  <td className="py-3 px-3 text-right">
                    {formatPercent((totals.grossProfit / totals.netSales) * 100)}
                  </td>
                  <td className="py-3 px-3 text-right">-</td>
                  <td className="py-3 px-3 text-right text-red-600">{formatCurrency(totals.totalCost)}</td>
                  <td className="py-3 px-3 text-right text-[#345fe1]">{formatCurrency(totals.profit)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedData.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}件を表示
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-[#345fe1] hover:bg-[#2a4bb3]" : "bg-transparent"}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
