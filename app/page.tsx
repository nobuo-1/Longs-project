"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar, Header } from "@/components/sidebar"
import type { MainSection, SubSection } from "@/components/sidebar"
import { DesignStudio } from "@/components/design-studio"
import { InventoryAI } from "@/components/inventory-ai"
import { InventoryAIInsights } from "@/components/inventory-ai-insights"
import { InventoryPlanning } from "@/components/inventory-planning"
import { InventoryAIAdvice } from "@/components/inventory-ai-advice"
import { FinanceFlow } from "@/components/finance-flow"
import { ProcurementList } from "@/components/procurement-list"
import { DataRegistration } from "@/components/data-registration"
import { DataHub } from "@/components/data-hub"

export default function Home() {
  const searchParams = useSearchParams()
  const validSections = useMemo<MainSection[]>(() => ["design", "inventory", "finance", "data"], [])
  const validSubSections = useMemo<SubSection[]>(
    () => [
      "design-pop",
      "design-history",
      "inventory-main",
      "inventory-insights",
      "inventory-catalog",
      "inventory-planning",
      "inventory-ai-advice",
      "inventory-procurement",
      "data-main",
      "data-registration",
      "finance-main",
      "finance-gantt",
    ],
    [],
  )
  const initialSection = useMemo<MainSection>(() => {
    const sectionParam = searchParams.get("section") as MainSection | null
    return sectionParam && validSections.includes(sectionParam) ? sectionParam : "design"
  }, [searchParams, validSections])
  const initialSubSection = useMemo<SubSection>(() => {
    const subParam = searchParams.get("sub") as SubSection | null
    return subParam && validSubSections.includes(subParam) ? subParam : "design-pop"
  }, [searchParams, validSubSections])
  const [activeSection, setActiveSection] = useState<MainSection>(initialSection)
  const [activeSubSection, setActiveSubSection] = useState<SubSection>(initialSubSection)

  const handleSectionChange = (section: MainSection, subSection: SubSection) => {
    setActiveSection(section)
    setActiveSubSection(subSection)
  }

  useEffect(() => {
    const sectionParam = searchParams.get("section") as MainSection | null
    const subParam = searchParams.get("sub") as SubSection | null
    if (sectionParam && subParam && validSections.includes(sectionParam) && validSubSections.includes(subParam)) {
      setActiveSection(sectionParam)
      setActiveSubSection(subParam)
    }
  }, [searchParams, validSections, validSubSections])

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
      case "inventory-insights":
        return <InventoryAIInsights />
      case "inventory-catalog":
        return <InventoryAI initialTab="catalog" />
      case "inventory-planning":
        return <InventoryPlanning />
      case "inventory-ai-advice":
        return <InventoryAIAdvice />
      case "inventory-procurement":
        return <ProcurementList />

      // Data pages
      case "data-main":
        return <DataHub />
      case "data-registration":
        return <DataRegistration />

      // Finance Flow pages
      case "finance-main":
        return <FinanceFlow initialTab="overview" />
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
        onSectionChangeAction={handleSectionChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">{renderContent()}</main>
      </div>
    </div>
  )
}
