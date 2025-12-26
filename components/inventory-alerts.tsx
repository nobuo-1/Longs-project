"use client"

import { useState } from "react"
import { AlertTriangle, Package, TrendingDown, Clock, Bell, BellOff, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
 
interface Alert {
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
  isRead: boolean
}

const alertsData: Alert[] = [
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
    isRead: false,
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
    isRead: false,
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
    isRead: false,
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
    isRead: true,
  },
  {
    id: 5,
    type: "low_stock",
    severity: "warning",
    product: "コットンTシャツ（白）",
    productId: "SKU002",
    category: "トップス",
    currentStock: 12,
    threshold: 20,
    message: "人気商品のため、早めの補充を推奨します。",
    date: "2024/12/17 11:00",
    isRead: true,
  },
  {
    id: 6,
    type: "overstock",
    severity: "info",
    product: "レザーベルト（茶）",
    productId: "SKU007",
    category: "アクセサリー",
    currentStock: 55,
    threshold: 40,
    message: "在庫が多めですが、ギフトシーズンで消化見込み。",
    date: "2024/12/16 09:30",
    isRead: true,
  },
]

export function InventoryAlerts() {
  const [alerts, setAlerts] = useState(alertsData)
  const [filter, setFilter] = useState<"all" | "low_stock" | "overstock" | "expiring">("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true
    return alert.type === filter
  })

  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.isRead).length
  const warningCount = alerts.filter((a) => a.severity === "warning" && !a.isRead).length

  const markAsRead = (id: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <TrendingDown className="w-5 h-5" />
      case "overstock":
        return <Package className="w-5 h-5" />
      case "expiring":
        return <Clock className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getAlertTypeLabel = (type: string) => {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-[#345fe1]" />
          在庫アラート
        </h2>
        <p className="text-muted-foreground">在庫不足・過剰・廃品リスクの自動検知</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium">緊急アラート</p>
                <p className="text-2xl font-bold text-red-700">{criticalCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-600 font-medium">警告アラート</p>
                <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">在庫不足</p>
                <p className="text-2xl font-bold">{alerts.filter((a) => a.type === "low_stock").length}</p>
              </div>
              <div className="w-10 h-10 bg-[#345fe1]/10 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#345fe1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">過剰在庫</p>
                <p className="text-2xl font-bold">{alerts.filter((a) => a.type === "overstock").length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    {filter === "all" ? "すべて" : getAlertTypeLabel(filter)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilter("all")}>すべて</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("low_stock")}>在庫不足</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("overstock")}>過剰在庫</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("expiring")}>廃品リスク</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="bg-transparent" onClick={markAllAsRead}>
                すべて既読にする
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">通知</span>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              {notificationsEnabled ? (
                <Bell className="w-4 h-4 text-[#345fe1]" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">アラート一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer",
                  alert.isRead ? "bg-muted/30" : "bg-muted/50 hover:bg-muted",
                )}
                onClick={() => markAsRead(alert.id)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    alert.severity === "critical"
                      ? "bg-red-100"
                      : alert.severity === "warning"
                        ? "bg-yellow-100"
                        : "bg-blue-100",
                  )}
                >
                  <div
                    className={cn(
                      alert.severity === "critical"
                        ? "text-red-600"
                        : alert.severity === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600",
                    )}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{alert.product}</span>
                    {!alert.isRead && <span className="w-2 h-2 bg-[#345fe1] rounded-full" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {alert.productId}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alert.category}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs",
                        alert.type === "low_stock"
                          ? "bg-red-100 text-red-700"
                          : alert.type === "overstock"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-purple-100 text-purple-700",
                      )}
                    >
                      {getAlertTypeLabel(alert.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{alert.date}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-muted-foreground">現在庫</p>
                  <p
                    className={cn("text-xl font-bold", alert.type === "low_stock" ? "text-red-600" : "text-foreground")}
                  >
                    {alert.currentStock}
                  </p>
                  <p className="text-xs text-muted-foreground">基準: {alert.threshold}</p>
                </div>

                <Button
                  size="sm"
                  className={cn(
                    "flex-shrink-0",
                    alert.type === "low_stock"
                      ? "bg-[#345fe1] hover:bg-[#2a4bb3] text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white",
                  )}
                >
                  {alert.type === "low_stock" ? "発注" : "セール設定"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
