"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Settings2, Wallet, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header, Sidebar, type MainSection, type SubSection } from "@/components/sidebar"

const categoryDefaults = [
  { id: "tops", name: "トップス", days: 60 },
  { id: "bottoms", name: "ボトムス", days: 60 },
  { id: "outer", name: "アウター", days: 90 },
  { id: "accessories", name: "アクセサリー", days: 60 },
]

const fixedCostDefaults = [
  { id: "rent", name: "家賃", amount: 980000, day: 25 },
  { id: "payroll", name: "人件費", amount: 4200000, day: 25 },
  { id: "logistics", name: "物流費", amount: 620000, day: 20 },
  { id: "saas", name: "SaaS / システム", amount: 180000, day: 15 },
]

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<MainSection>("design")
  const [activeSubSection, setActiveSubSection] = useState<SubSection>("design-pop")
  const [categorySettings, setCategorySettings] = useState(categoryDefaults)
  const [categoryDraft, setCategoryDraft] = useState(categoryDefaults)
  const [isCategoryEditing, setIsCategoryEditing] = useState(false)
  const [fixedCosts, setFixedCosts] = useState(fixedCostDefaults)
  const [fixedCostsDraft, setFixedCostsDraft] = useState(fixedCostDefaults)
  const [isFixedEditing, setIsFixedEditing] = useState(false)

  const handleSectionChange = (section: MainSection, subSection: SubSection) => {
    setActiveSection(section)
    setActiveSubSection(subSection)
    router.push(`/?section=${section}&sub=${subSection}`)
  }

  const handleCategoryEdit = () => {
    setCategoryDraft(categorySettings.map((item) => ({ ...item })))
    setIsCategoryEditing(true)
  }

  const handleCategorySave = () => {
    setCategorySettings(categoryDraft.map((item) => ({ ...item })))
    setIsCategoryEditing(false)
  }

  const handleCategoryCancel = () => {
    setCategoryDraft(categorySettings.map((item) => ({ ...item })))
    setIsCategoryEditing(false)
  }

  const handleFixedEdit = () => {
    setFixedCostsDraft(fixedCosts.map((item) => ({ ...item })))
    setIsFixedEditing(true)
  }

  const handleFixedSave = () => {
    setFixedCosts(fixedCostsDraft.map((item) => ({ ...item })))
    setIsFixedEditing(false)
  }

  const handleFixedCancel = () => {
    setFixedCostsDraft(fixedCosts.map((item) => ({ ...item })))
    setIsFixedEditing(false)
  }

  const handleAddFixedCost = () => {
    setFixedCostsDraft((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, name: "新規項目", amount: 0, day: 25 },
    ])
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSectionChangeAction={handleSectionChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-white">
          <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Settings</p>
                <h1 className="text-2xl font-bold text-foreground">システム設定</h1>
                <p className="text-muted-foreground">カテゴリ別の売り切り期限など、基本設定を管理します。</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  設定を保存（ダミー）
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#345fe1]" />
                    カテゴリ別 売り切り期限設定
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isCategoryEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCategoryCancel}>
                          キャンセル
                        </Button>
                        <Button size="sm" className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" onClick={handleCategorySave}>
                          保存
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleCategoryEdit}>
                        編集
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isCategoryEditing ? categoryDraft : categorySettings).map((cat, index) => (
                  <div key={cat.id} className="p-3 border border-border rounded-lg space-y-2">
                    <p className="text-sm font-semibold">{cat.name}</p>
                    {isCategoryEditing ? (
                      <Input
                        type="number"
                        value={categoryDraft[index].days}
                        onChange={(e) =>
                          setCategoryDraft((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, days: Number(e.target.value) } : item,
                            ),
                          )
                        }
                      />
                    ) : (
                      <p className="text-lg font-bold text-foreground">{cat.days} 日</p>
                    )}
                    <p className="text-xs text-muted-foreground">売り切り目標日数</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#345fe1]" />
                    固定費の設定
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isFixedEditing && (
                      <Button variant="outline" size="sm" onClick={handleAddFixedCost}>
                        <Plus className="w-4 h-4 mr-1" />
                        項目追加
                      </Button>
                    )}
                    {isFixedEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleFixedCancel}>
                          キャンセル
                        </Button>
                        <Button size="sm" className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" onClick={handleFixedSave}>
                          保存
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleFixedEdit}>
                        編集
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(isFixedEditing ? fixedCostsDraft : fixedCosts).map((item, index) => (
                  <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {isFixedEditing ? (
                        <Input
                          value={fixedCostsDraft[index].name}
                          onChange={(e) =>
                            setFixedCostsDraft((prev) =>
                              prev.map((cost, idx) => (idx === index ? { ...cost, name: e.target.value } : cost)),
                            )
                          }
                        />
                      ) : (
                        <p className="text-sm font-semibold">{item.name}</p>
                      )}
                      {isFixedEditing && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setFixedCostsDraft((prev) => prev.filter((cost) => cost.id !== item.id))
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">月額</p>
                        {isFixedEditing ? (
                          <Input
                            type="number"
                            value={fixedCostsDraft[index].amount}
                            onChange={(e) =>
                              setFixedCostsDraft((prev) =>
                                prev.map((cost, idx) =>
                                  idx === index ? { ...cost, amount: Number(e.target.value) } : cost,
                                ),
                              )
                            }
                          />
                        ) : (
                          <p className="text-lg font-bold text-foreground">
                            {new Intl.NumberFormat("ja-JP").format(item.amount)} 円
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">支払日</p>
                        {isFixedEditing ? (
                          <Input
                            type="number"
                            value={fixedCostsDraft[index].day}
                            onChange={(e) =>
                              setFixedCostsDraft((prev) =>
                                prev.map((cost, idx) => (idx === index ? { ...cost, day: Number(e.target.value) } : cost)),
                              )
                            }
                          />
                        ) : (
                          <p className="text-lg font-bold text-foreground">{item.day} 日</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
