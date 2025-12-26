"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Calendar, Settings2, Smartphone, Building2, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    receivable: "当月末払い",
    payable: "翌月15日払い",
    fixedCost: "毎月5日",
  }) 

  const [notifications, setNotifications] = useState({
    reminder: true,
    threshold: true,
    mobile: true,
    slack: false,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#345fe1]/10 via-white to-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="outline" className="bg-white/80">
              設定
            </Badge>
            <h1 className="text-2xl font-bold text-foreground">振込サイト・固定費・通知のまとめ設定</h1>
            <p className="text-muted-foreground">
              当月払い/翌月払いなどのサイトと、固定費や通知をまとめて管理。スマホ表示を意識したUIも確認できます。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/">
              <Button variant="outline">ダッシュボードへ戻る</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">ログインページへ</Button>
            </Link>
            <Button className="gap-2">
              <Settings2 className="w-4 h-4" />
              設定を保存（ダミー）
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#345fe1]" />
                振込サイトと締め日のルール
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                主要なサイトパターンを選択し、ガントチャートと連動。数百社の小口先は「その他取引先」として一括反映します。
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>売上入金サイト</Label>
                <Select
                  value={siteSettings.receivable}
                  onValueChange={(value: string) => setSiteSettings((prev) => ({ ...prev, receivable: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="当月末払い">当月末払い</SelectItem>
                    <SelectItem value="翌月末払い">翌月末払い</SelectItem>
                    <SelectItem value="翌々月15日払い">翌々月15日払い</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  ガントチャートの入金色（青）に適用。サイト別のチップにも表示されます。
                </p>
              </div>

              <div className="space-y-2">
                <Label>仕入支払いサイト</Label>
                <Select
                  value={siteSettings.payable}
                  onValueChange={(value: string) => setSiteSettings((prev) => ({ ...prev, payable: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="当月末払い">当月末払い</SelectItem>
                    <SelectItem value="翌月15日払い">翌月15日払い</SelectItem>
                    <SelectItem value="翌々月末払い">翌々月末払い</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  支払い（赤）の支払サイト。海外仕入など長めのサイトもここで揃えます。
                </p>
              </div>

              <div className="space-y-2">
                <Label>固定費の支払日</Label>
                <Select
                  value={siteSettings.fixedCost}
                  onValueChange={(value: string) => setSiteSettings((prev) => ({ ...prev, fixedCost: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="毎月1日">毎月1日</SelectItem>
                    <SelectItem value="毎月5日">毎月5日</SelectItem>
                    <SelectItem value="毎月25日">毎月25日</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">家賃・人件費・サブスクなどの固定費に反映します。</p>
              </div>

              <div className="space-y-2">
                <Label>締め日</Label>
                <Input type="number" min={1} max={31} defaultValue={30} />
                <p className="text-xs text-muted-foreground">
                  30日締め／末締めなどを記録。支払サイト計算のメモとして利用します。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#345fe1]" />
                通知・リマインダー
              </CardTitle>
              <p className="text-sm text-muted-foreground">支払い前日や固定費の超過をモバイルにも配信。</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">振込前日リマインド</p>
                  <p className="text-xs text-muted-foreground">前日朝にプッシュとメールで通知</p>
                </div>
                <Switch
                  checked={notifications.reminder}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications((prev) => ({ ...prev, reminder: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">固定費の超過検知</p>
                  <p className="text-xs text-muted-foreground">月次固定費が予算を超えたら通知</p>
                </div>
                <Switch
                  checked={notifications.threshold}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications((prev) => ({ ...prev, threshold: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">スマホ通知を優先</p>
                  <p className="text-xs text-muted-foreground">営業先でも確認しやすい軽量カード表示</p>
                </div>
                <Switch
                  checked={notifications.mobile}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications((prev) => ({ ...prev, mobile: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Slack送信</p>
                  <p className="text-xs text-muted-foreground">#finance チャンネルにリマインドを送付</p>
                </div>
                <Switch
                  checked={notifications.slack}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications((prev) => ({ ...prev, slack: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">モバイル連携</Badge>
                <Badge variant="outline">メール</Badge>
                <Badge variant="outline">Slack</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#345fe1]" />
                会社・口座情報（ダミー入力）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>会社名</Label>
                <Input defaultValue="Apparel & Co. 合同会社" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>取引銀行</Label>
                  <Input defaultValue="みずほ銀行 青山支店" />
                </div>
                <div className="space-y-2">
                  <Label>口座番号</Label>
                  <Input defaultValue="1234567 (普通)" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>担当者メモ</Label>
                <Input defaultValue="経理: 佐藤 / 照合は毎週月曜" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#345fe1]" />
                レスポンシブ・モバイルプレビュー
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                モバイルではカード幅を縮めて横スクロール、年間ガントはスワイプ対応。設定ページも2カラム→1カラムに自動調整します。
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-lg border bg-muted/40">
                  <p className="font-semibold">Desktop</p>
                  <p className="text-muted-foreground">3〜4カラム表示</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="font-semibold">Tablet</p>
                  <p className="text-muted-foreground">2カラム / スクロール</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/20">
                  <p className="font-semibold">Mobile</p>
                  <p className="text-muted-foreground">1カラム + 横スワイプ</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                入力内容はダミー保存です。実データはまだ送信されません。
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">スマホ対応</Badge>
                <Badge variant="outline">ガントチャート</Badge>
                <Badge variant="outline">固定費</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
