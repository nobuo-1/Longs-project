"use client"

import { useState } from "react"
import {
  Bot,
  CloudSun,
  Globe,
  TrendingUp,
  Calendar,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Shirt,
  Footprints,
  Briefcase,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// AI Advice data - weekly summaries
const weeklyAdvices = [
  {
    id: 1,
    week: "2024年12月第3週",
    date: "2024/12/16 - 2024/12/22",
    isLatest: true,
    summary:
      "年末商戦に向けて、アウター類の需要が急増しています。特にダウンジャケットとウールコートの在庫確保を推奨します。",
    categories: [
      {
        name: "アウター",
        icon: Shirt,
        trend: "up",
        advice: "寒波到来予報により、ダウンジャケットの需要が前週比150%増加見込み。追加発注を推奨。",
        confidence: 92,
      },
      {
        name: "シューズ",
        icon: Footprints,
        trend: "up",
        advice: "防寒ブーツの検索トレンドが上昇中。在庫を20%増やすことを推奨。",
        confidence: 85,
      },
      {
        name: "バッグ",
        icon: Briefcase,
        trend: "stable",
        advice: "年末ギフト需要でレザーバッグが好調。現状維持で問題なし。",
        confidence: 78,
      },
    ],
    factors: [
      {
        type: "weather",
        icon: CloudSun,
        title: "気象情報",
        content: "来週は全国的に気温が平年より5度低い見込み。積雪の可能性あり。",
        impact: "high",
      },
      {
        type: "global",
        icon: Globe,
        title: "国際情勢",
        content: "中国からの輸入が通常通り。物流に大きな遅延なし。",
        impact: "low",
      },
      {
        type: "trend",
        icon: TrendingUp,
        title: "トレンド分析",
        content: "SNSで「ミニマルファッション」がトレンド。無地アイテムの需要増加。",
        impact: "medium",
      },
    ],
    actions: [
      { text: "ダウンジャケット 50点追加発注", priority: "high", category: "アウター" },
      { text: "防寒ブーツ 30点追加発注", priority: "high", category: "シューズ" },
      { text: "ウールコート在庫確認", priority: "medium", category: "アウター" },
      { text: "春物の入荷準備開始", priority: "low", category: "全般" },
    ],
  },
  {
    id: 2,
    week: "2024年12月第2週",
    date: "2024/12/09 - 2024/12/15",
    isLatest: false,
    summary: "冬物セールに向けた準備期間。在庫調整と価格見直しを推奨します。",
    categories: [
      {
        name: "アウター",
        icon: Shirt,
        trend: "stable",
        advice: "冬物コートの売れ行きが安定。セール前の価格維持を推奨。",
        confidence: 88,
      },
      {
        name: "シューズ",
        icon: Footprints,
        trend: "down",
        advice: "秋物シューズの在庫消化を優先。値引き販売を検討。",
        confidence: 82,
      },
      {
        name: "バッグ",
        icon: Briefcase,
        trend: "up",
        advice: "クリスマスギフト需要でバッグの売上増加中。",
        confidence: 75,
      },
    ],
    factors: [
      {
        type: "weather",
        icon: CloudSun,
        title: "気象情報",
        content: "週末にかけて気温低下。防寒具の需要増加見込み。",
        impact: "medium",
      },
      {
        type: "global",
        icon: Globe,
        title: "国際情勢",
        content: "アジア地域の物流が一部遅延。2-3日の遅れを想定。",
        impact: "medium",
      },
      {
        type: "trend",
        icon: TrendingUp,
        title: "トレンド分析",
        content: "インフルエンサーによるアウター紹介が話題。特定商品の需要急増。",
        impact: "high",
      },
    ],
    actions: [
      { text: "秋物シューズ 20%オフセール開始", priority: "high", category: "シューズ" },
      { text: "クリスマスギフトコーナー設置", priority: "medium", category: "全般" },
      { text: "防寒小物の店頭配置変更", priority: "low", category: "アクセサリー" },
    ],
  },
  {
    id: 3,
    week: "2024年12月第1週",
    date: "2024/12/02 - 2024/12/08",
    isLatest: false,
    summary: "12月商戦スタート。クリスマス需要に向けた品揃え強化を推奨します。",
    categories: [
      {
        name: "アウター",
        icon: Shirt,
        trend: "up",
        advice: "本格的な冬の到来でアウター需要が増加。在庫補充を推奨。",
        confidence: 90,
      },
      {
        name: "シューズ",
        icon: Footprints,
        trend: "stable",
        advice: "革靴の需要が安定。年末の忘年会シーズンに向けて在庫維持。",
        confidence: 80,
      },
      {
        name: "バッグ",
        icon: Briefcase,
        trend: "up",
        advice: "ギフト需要の立ち上がり。ラッピング対応の準備を。",
        confidence: 85,
      },
    ],
    factors: [
      {
        type: "weather",
        icon: CloudSun,
        title: "気象情報",
        content: "平年並みの気温。急激な変化なし。",
        impact: "low",
      },
      {
        type: "global",
        icon: Globe,
        title: "国際情勢",
        content: "物流は安定。年末に向けて発注リードタイムに注意。",
        impact: "low",
      },
      {
        type: "trend",
        icon: TrendingUp,
        title: "トレンド分析",
        content: "エコファッション、サステナブル商品への関心が高まる。",
        impact: "medium",
      },
    ],
    actions: [
      { text: "クリスマスギフト向け商品の陳列", priority: "high", category: "全般" },
      { text: "年末年始の営業時間確定", priority: "medium", category: "運営" },
      { text: "春物カタログの確認", priority: "low", category: "全般" },
    ],
  },
]

const newsItems = [
  {
    title: "原材料コスト上昇：ウール糸の国際価格が前月比+8%",
    source: "日経ファッション",
    time: "2時間前",
    impact: "high",
    summary: "欧州の寒波と物流混乱でウール糸価格が上昇。コート類の原価率上振れが想定されるため、価格転嫁と在庫調整を検討。",
    tag: "原材料",
  },
  {
    title: "主要ECモールのアルゴリズム更新で商品露出が変動",
    source: "ECジャーナル",
    time: "5時間前",
    impact: "medium",
    summary: "商品タイトルと素材情報の充実が上位表示に寄与。商品マスタの一括更新を推奨。",
    tag: "EC",
  },
  {
    title: "物流：港湾の一部混雑解消、納期が通常リードタイムへ",
    source: "ロジスティクス通信",
    time: "昨日",
    impact: "low",
    summary: "海外工場からの仕入れが平常化。翌月末払いのキャッシュアウトが平準化する見込み。",
    tag: "物流",
  },
]

export function InventoryAIAdvice() {
  const [selectedWeek, setSelectedWeek] = useState(weeklyAdvices[0])
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, "up" | "down" | null>>({})

  const handleFeedback = (actionIndex: number, type: "up" | "down") => {
    setFeedbackGiven((prev) => ({ ...prev, [actionIndex]: type }))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#345fe1]" />
          AIアドバイス
        </h2>
        <p className="text-muted-foreground">天気、気温、国際情勢などの幅広い視点からの週次アドバイス</p>
      </div>

      {/* Week Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#345fe1]" />
              <span className="font-medium">週次レポート選択</span>
            </div>
            <div className="flex gap-2">
              {weeklyAdvices.map((advice) => (
                <Button
                  key={advice.id}
                  variant={selectedWeek.id === advice.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedWeek(advice)}
                  className={cn(
                    selectedWeek.id === advice.id
                      ? "bg-[#345fe1] hover:bg-[#2a4bb3] text-white"
                      : "bg-transparent border-border hover:bg-muted",
                  )}
                >
                  {advice.isLatest && <Sparkles className="w-3 h-3 mr-1" />}
                  {advice.week}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="mb-6 bg-gradient-to-r from-[#345fe1] to-[#2a4bb3] text-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">{selectedWeek.week}</h3>
                {selectedWeek.isLatest && <Badge className="bg-white/20 text-white hover:bg-white/30">最新</Badge>}
              </div>
              <p className="text-sm text-white/70 mb-2">{selectedWeek.date}</p>
              <p className="text-white/90">{selectedWeek.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {selectedWeek.categories.map((cat, index) => {
          const Icon = cat.icon
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#345fe1]/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#345fe1]" />
                    </div>
                    <span className="font-bold">{cat.name}</span>
                  </div>
                  <Badge
                    className={cn(
                      cat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : cat.trend === "down"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {cat.trend === "up" ? "↑ 上昇" : cat.trend === "down" ? "↓ 下降" : "→ 安定"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{cat.advice}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#345fe1] rounded-full" style={{ width: `${cat.confidence}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">信頼度 {cat.confidence}%</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Impact Factors */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">影響要因分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedWeek.factors.map((factor, index) => {
              const Icon = factor.icon
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border",
                    factor.impact === "high"
                      ? "border-red-200 bg-red-50"
                      : factor.impact === "medium"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-green-200 bg-green-50",
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        factor.impact === "high"
                          ? "text-red-600"
                          : factor.impact === "medium"
                            ? "text-yellow-600"
                            : "text-green-600",
                      )}
                    />
                    <span className="font-medium">{factor.title}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-auto text-xs",
                        factor.impact === "high"
                          ? "border-red-300 text-red-700"
                          : factor.impact === "medium"
                            ? "border-yellow-300 text-yellow-700"
                            : "border-green-300 text-green-700",
                      )}
                    >
                      {factor.impact === "high" ? "高影響" : factor.impact === "medium" ? "中影響" : "低影響"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.content}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Industry News */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">業界ニュース（アパレル影響）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {newsItems.map((news, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-border/70 hover:border-[#345fe1]/60 hover:shadow-sm transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      news.impact === "high"
                        ? "bg-red-100 text-red-700"
                        : news.impact === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700",
                    )}
                  >
                    影響度: {news.impact === "high" ? "高" : news.impact === "medium" ? "中" : "低"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {news.tag}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {news.source} ・ {news.time}
                </span>
              </div>
              <p className="font-semibold">{news.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{news.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">推奨アクション</CardTitle>
            <Button variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              再分析
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedWeek.actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-2 h-10 rounded-full",
                      action.priority === "high"
                        ? "bg-red-500"
                        : action.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500",
                    )}
                  />
                  <div>
                    <p className="font-medium">{action.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {action.category}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          action.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : action.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700",
                        )}
                      >
                        {action.priority === "high" ? "緊急" : action.priority === "medium" ? "推奨" : "検討"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground mr-2">役立ちましたか？</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("w-8 h-8", feedbackGiven[index] === "up" && "bg-green-100 text-green-700")}
                    onClick={() => handleFeedback(index, "up")}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("w-8 h-8", feedbackGiven[index] === "down" && "bg-red-100 text-red-700")}
                    onClick={() => handleFeedback(index, "down")}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white ml-2">
                    実行
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
