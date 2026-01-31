"use client"

import { useMemo } from "react"
import { Trash2, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useProcurementList } from "@/hooks/use-procurement-list"
import { cn } from "@/lib/utils"

const formatNumber = (value: number) => new Intl.NumberFormat("ja-JP").format(value)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value)

export function ProcurementList() {
  const { items, updateOrderQty, removeItem, clearItems } = useProcurementList()

  const totals = useMemo(() => {
    const totalOrderQty = items.reduce((acc, item) => acc + item.orderQty, 0)
    const totalAmount = items.reduce((acc, item) => acc + item.orderQty * item.price, 0)
    return { totalOrderQty, totalAmount }
  }, [items])

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Inventory AI</p>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#345fe1]" />
            仕入れリスト
          </h2>
          <p className="text-muted-foreground">仕入れ提案から追加した発注候補をまとめて確認できます。</p>
        </div>
        <Button
          variant="outline"
          onClick={clearItems}
          disabled={items.length === 0}
          className="text-[#345fe1] border-[#345fe1]"
        >
          すべてクリア
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-muted/40">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">登録アイテム</p>
            <p className="text-lg font-bold">{items.length} 件</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">発注数量合計</p>
            <p className="text-lg font-bold">{formatNumber(totals.totalOrderQty)} 点</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">概算仕入れ金額</p>
            <p className="text-lg font-bold">{formatCurrency(totals.totalAmount)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">発注候補一覧</CardTitle>
          <Badge variant="outline" className="bg-muted/40">
            {items.length} 件
          </Badge>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              仕入れ提案から「発注に追加」を押すと、ここに表示されます。
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">商品</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">カテゴリ</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">現在庫</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">推奨発注</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">発注数</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">概算金額</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">ステータス</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-border/70">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3 text-right font-medium">{item.currentStock}点</td>
                      <td className="px-4 py-3 text-right font-bold text-[#345fe1]">{item.suggestedOrder}点</td>
                      <td className="px-4 py-3 text-right">
                        <Input
                          type="number"
                          min={0}
                          value={item.orderQty}
                          onChange={(e) => updateOrderQty(item.id, Number(e.target.value))}
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(item.orderQty * item.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={cn(
                            "px-3 py-1",
                            item.status === "high"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : item.status === "overstock"
                                ? "bg-red-100 text-red-700 hover:bg-red-100"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {item.status === "high" ? "高需要" : item.status === "overstock" ? "過剰在庫" : "通常"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => removeItem(item.id)} aria-label="削除">
                          <Trash2 className="w-4 h-4 text-[#345fe1]" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
