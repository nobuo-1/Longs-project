"use client"

import { useState } from "react"
import { Sidebar, Header } from "@/components/sidebar"
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
  | "design-pop"
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
  const [activeSubSection, setActiveSubSection] = useState<SubSection>("design-pop")

  const handleSectionChange = (section: MainSection, subSection: SubSection) => {
    setActiveSection(section)
    setActiveSubSection(subSection)
  }

  const renderContent = () => {
    switch (activeSubSection) {
      // Design Studio pages
      case "design-pop":
        return <DesignStudio initialType="pop" />
      case "design-history":
        return <DesignStudio showHistory />

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
        return <DesignStudio initialType="pop" />
    }
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSectionChange={handleSectionChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">{renderContent()}</main>
      </div>
    </div>
  )
}
