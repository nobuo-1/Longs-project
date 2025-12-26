"use client"

import { useState } from "react"
import { Sidebar, Header } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DesignStudio } from "@/components/design-studio"
import { InventoryAI } from "@/components/inventory-ai"
import { InventoryTable } from "@/components/inventory-table"
import { InventoryPlanning } from "@/components/inventory-planning"
import { InventoryAIAdvice } from "@/components/inventory-ai-advice"
import { InventoryImport } from "@/components/inventory-import"
import { InventoryAlerts } from "@/components/inventory-alerts"
import { FinanceFlow } from "@/components/finance-flow"

type MainSection = "design" | "inventory" | "finance"
type SubSection =
  | "design-main"
  | "design-pop"
  | "design-poster"
  | "design-history"
  | "inventory-main"
  | "inventory-table"
  | "inventory-catalog"
  | "inventory-planning"
  | "inventory-ai-advice"
  | "inventory-import"
  | "inventory-alerts"
  | "finance-main"
  | "finance-reserve"
  | "finance-gantt"

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("design")
  const [activeSubSection, setActiveSubSection] = useState<SubSection>("design-main")

  const sectionTabs: Record<MainSection, { id: SubSection; label: string }[]> = {
    design: [
      { id: "design-main", label: "デザイン作成" },
      { id: "design-pop", label: "POP" },
      { id: "design-poster", label: "ポスター" },
      { id: "design-history", label: "履歴" },
    ],
    inventory: [
      { id: "inventory-main", label: "仕入れ提案" },
      { id: "inventory-table", label: "データハブ" },
      { id: "inventory-catalog", label: "カタログ" },
      { id: "inventory-planning", label: "計画" },
      { id: "inventory-ai-advice", label: "AIアドバイス" },
      { id: "inventory-import", label: "インポート" },
      { id: "inventory-alerts", label: "アラート" },
    ],
    finance: [
      { id: "finance-main", label: "概要" },
      { id: "finance-reserve", label: "内部留保" },
      { id: "finance-gantt", label: "ガント" },
    ],
  }

  const handleSectionChange = (section: MainSection, subSection: SubSection) => {
    setActiveSection(section)
    setActiveSubSection(subSection)
  }

  const renderContent = () => {
    switch (activeSubSection) {
      // Design Studio pages
      case "design-main":
      case "design-pop":
      case "design-poster":
      case "design-history":
        return (
          <DesignStudio
            initialType={
              activeSubSection === "design-pop" ? "pop" : activeSubSection === "design-poster" ? "poster" : undefined
            }
            showHistory={activeSubSection === "design-history"}
          />
        )

      // Inventory AI pages
      case "inventory-main":
        return <InventoryAI initialTab="recommendations" />
      case "inventory-table":
        return <InventoryTable />
      case "inventory-catalog":
        return <InventoryAI initialTab="catalog" />
      case "inventory-planning":
        return <InventoryPlanning />
      case "inventory-ai-advice":
        return <InventoryAIAdvice />
      case "inventory-import":
        return <InventoryImport />
      case "inventory-alerts":
        return <InventoryAlerts />

      // Finance Flow pages
      case "finance-main":
        return <FinanceFlow initialTab="overview" />
      case "finance-reserve":
        return <FinanceFlow initialTab="reserve" />
      case "finance-gantt":
        return <FinanceFlow initialTab="gantt" />

      default:
        return <DesignStudio />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSectionChange={handleSectionChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">
                    {activeSection === "design" && "デザインスタジオ"}
                    {activeSection === "inventory" && "在庫AIハブ"}
                    {activeSection === "finance" && "ファイナンスフロー"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    配下ページをトグルで切替えて同じカード内で閲覧できます。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sectionTabs[activeSection].map((tab) => (
                    <Button
                      key={tab.id}
                      size="sm"
                      variant={activeSubSection === tab.id ? "default" : "outline"}
                      onClick={() => handleSectionChange(activeSection, tab.id)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">{renderContent()}</CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
