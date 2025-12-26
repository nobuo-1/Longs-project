"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Sparkles, ImageIcon, Download, Check, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface DesignStudioProps {
  initialType?: "pop" | "poster"
  showHistory?: boolean
}
 
const colorPalette = [
  { name: "ネイビー", hex: "#1e3a5f" },
  { name: "ロイヤルブルー", hex: "#345fe1" },
  { name: "スカイブルー", hex: "#4a90a4" },
  { name: "ティール", hex: "#2dd4bf" },
  { name: "エメラルド", hex: "#10b981" },
  { name: "フォレスト", hex: "#22c55e" },
  { name: "ライム", hex: "#84cc16" },
  { name: "イエロー", hex: "#fbbf24" },
  { name: "オレンジ", hex: "#f97316" },
  { name: "コーラル", hex: "#fb7185" },
  { name: "レッド", hex: "#ef4444" },
  { name: "ピンク", hex: "#ec4899" },
  { name: "パープル", hex: "#a855f7" },
  { name: "バイオレット", hex: "#8b5cf6" },
  { name: "インディゴ", hex: "#6366f1" },
  { name: "ベージュ", hex: "#f5e6d3" },
  { name: "ブラウン", hex: "#92400e" },
  { name: "グレー", hex: "#6b7280" },
  { name: "スレート", hex: "#475569" },
  { name: "ブラック", hex: "#171717" },
]

const styles = [
  { id: "modern", name: "モダン", image: "/modern-minimalist-design-style.jpg" },
  { id: "retro", name: "レトロ", image: "/retro-vintage-design-style.jpg" },
  { id: "street", name: "ストリート", image: "/street-urban-design-style.jpg" },
  { id: "elegant", name: "エレガント", image: "/elegant-luxury-design-style.jpg" },
  { id: "casual", name: "カジュアル", image: "/casual-friendly-design-style.jpg" },
  { id: "sporty", name: "スポーティー", image: "/sporty-dynamic-design-style.jpg" },
]

const aspectRatios = [
  { id: "1:1", label: "1:1", desc: "正方形" },
  { id: "9:16", label: "9:16", desc: "縦長" },
  { id: "4:5", label: "4:5", desc: "SNS向け" },
  { id: "16:9", label: "16:9", desc: "横長" },
  { id: "A4", label: "A4", desc: "印刷用" },
]

const outputTypes: { id: "pop" | "poster"; name: string; desc: string }[] = [
  { id: "pop", name: "POP", desc: "店頭POP向け" },
  { id: "poster", name: "ポスター", desc: "大型印刷向け" },
]

const historyData = [
  {
    id: 1,
    type: "pop",
    title: "春セールPOP",
    createdAt: "2024-04-15 14:30",
    image: "/apparel-fashion-sale-promotional-poster-design.jpg",
    style: "モダン",
  },
  {
    id: 2,
    type: "poster",
    title: "新作コレクション",
    createdAt: "2024-04-14 10:15",
    image: "/fashion-poster-summer-collection.jpg",
    style: "エレガント",
  },
  {
    id: 3,
    type: "pop",
    title: "会員限定セール",
    createdAt: "2024-04-13 16:45",
    image: "/members-only-sale-pop.jpg",
    style: "カジュアル",
  },
  {
    id: 4,
    type: "poster",
    title: "夏物先行販売",
    createdAt: "2024-04-12 09:00",
    image: "/summer-pre-sale-poster.jpg",
    style: "ストリート",
  },
  {
    id: 5,
    type: "pop",
    title: "タイムセール",
    createdAt: "2024-04-11 13:20",
    image: "/time-sale-pop-design.jpg",
    style: "レトロ",
  },
  {
    id: 6,
    type: "poster",
    title: "ブランドフェア",
    createdAt: "2024-04-10 11:00",
    image: "/brand-fair-poster.jpg",
    style: "モダン",
  },
]

export function DesignStudio({ initialType, showHistory = false }: DesignStudioProps) {
  const [selectedColor, setSelectedColor] = useState(colorPalette[1].hex)
  const [catchphrase, setCatchphrase] = useState("")
  const [mainText, setMainText] = useState("")
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("modern")
  const [selectedRatio, setSelectedRatio] = useState("1:1")
  const [selectedType, setSelectedType] = useState<"pop" | "poster">(initialType || "pop")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [historyFilter, setHistoryFilter] = useState<"all" | "pop" | "poster">("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedImage("/apparel-fashion-sale-promotional-poster-design.jpg")
      setIsGenerating(false)
    }, 2000)
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = `design-${selectedType}-${Date.now()}.png`
      link.click()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredHistory = historyData.filter((item) => historyFilter === "all" || item.type === historyFilter)

  if (showHistory) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">作成履歴</h2>
          <p className="text-muted-foreground">過去に作成したデザインの一覧</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={historyFilter === "all" ? "default" : "outline"}
            onClick={() => setHistoryFilter("all")}
            className={historyFilter === "all" ? "bg-[#345fe1] hover:bg-[#2a4bb3]" : "bg-transparent"}
          >
            すべて
          </Button>
          <Button
            variant={historyFilter === "pop" ? "default" : "outline"}
            onClick={() => setHistoryFilter("pop")}
            className={historyFilter === "pop" ? "bg-[#345fe1] hover:bg-[#2a4bb3]" : "bg-transparent"}
          >
            POP
          </Button>
          <Button
            variant={historyFilter === "poster" ? "default" : "outline"}
            onClick={() => setHistoryFilter("poster")}
            className={historyFilter === "poster" ? "bg-[#345fe1] hover:bg-[#2a4bb3]" : "bg-transparent"}
          >
            ポスター
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="bg-white text-foreground hover:bg-white/90">
                      <Download className="w-4 h-4 mr-1" />
                      保存
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white text-red-600 hover:bg-white/90">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="font-medium text-foreground">{item.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      item.type === "pop" ? "bg-[#345fe1]/10 text-[#345fe1]" : "bg-green-100 text-green-700",
                    )}
                  >
                    {item.type === "pop" ? "POP" : "ポスター"}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">スタイル: {item.style}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {initialType === "pop" ? "POP作成" : initialType === "poster" ? "ポスター作成" : "デザインスタジオ"}
        </h2>
        <p className="text-muted-foreground">
          {initialType === "pop"
            ? "店頭POP向けのデザインを作成"
            : initialType === "poster"
              ? "大型印刷向けポスターを作成"
              : "POPやポスターを簡単に作成"}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Settings */}
        <div className="space-y-4">
          {!initialType && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">出力タイプ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {outputTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        selectedType === type.id
                          ? "border-[#345fe1] bg-[#345fe1]/5"
                          : "border-border hover:border-[#345fe1]/50",
                      )}
                    >
                      <p className="font-semibold text-foreground">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Color Picker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">カラーパレット</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {colorPalette.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className={cn(
                      "w-full aspect-square rounded-lg transition-all hover:scale-105 relative group",
                      selectedColor === color.hex && "ring-2 ring-[#345fe1] ring-offset-2",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.hex && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                    )}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-8">
                <div className="w-10 h-10 rounded-lg border shadow-sm" style={{ backgroundColor: selectedColor }} />
                <Input
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="font-mono text-sm flex-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Text Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">テキスト入力</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="catchphrase">キャッチフレーズ</Label>
                <Input
                  id="catchphrase"
                  placeholder="例: 今だけの特別価格！"
                  value={catchphrase}
                  onChange={(e) => setCatchphrase(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mainText">メインテキスト</Label>
                <Input
                  id="mainText"
                  placeholder="例: 春の新作コレクション"
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reference Image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">参照画像</CardTitle>
            </CardHeader>
            <CardContent>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="アップロード画像"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-[#345fe1] transition-colors cursor-pointer"
                >
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">ドラッグ＆ドロップ または クリック</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG (最大 10MB)</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Style & Prompt */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">スタイル</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "p-2 rounded-xl border-2 transition-all",
                      selectedStyle === style.id
                        ? "border-[#345fe1] bg-[#345fe1]/5"
                        : "border-border hover:border-[#345fe1]/50",
                    )}
                  >
                    <img
                      src={style.image || "/placeholder.svg"}
                      alt={style.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs font-medium text-center">{style.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Aspect Ratio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">アスペクト比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedRatio === ratio.id
                        ? "bg-[#345fe1] text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    <span>{ratio.label}</span>
                    <span className="text-xs opacity-70 ml-1">({ratio.desc})</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">プロンプト</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="デザインの詳細な指示を入力してください。例: 春らしい明るい雰囲気で、花柄のパターンを背景に配置し、セール情報を目立たせてください。"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                詳細な指示を入力することで、より希望に近いデザインが生成されます。
              </p>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-[#345fe1] hover:bg-[#2a4bb3] text-white"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            画像を生成
          </Button>
        </div>

        {/* Right Column - Preview */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">プレビュー</CardTitle>
                {generatedImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="text-[#345fe1] border-[#345fe1] hover:bg-[#345fe1]/10 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ダウンロード
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 bg-muted rounded-xl flex items-center justify-center min-h-[400px] relative overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#345fe1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground">生成中...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt="生成された画像"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mx-auto mb-3" />
                    <p>生成された画像がここに表示されます</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
