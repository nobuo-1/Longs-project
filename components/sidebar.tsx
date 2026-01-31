"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Palette,
  Package,
  Wallet,
  Shirt,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  Table,
  BookOpen,
  TrendingUp,
  Calendar,
  Bot,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type MainSection = "design" | "inventory" | "finance" | "data"
export type SubSection =
  | "design-pop"
  | "design-history"
  | "inventory-main"
  | "inventory-insights"
  | "inventory-catalog"
  | "inventory-planning"
  | "inventory-ai-advice"
  | "inventory-procurement"
  | "finance-main"
  | "finance-gantt"
  | "data-main"
  | "data-registration"

interface SidebarProps {
  activeSection: MainSection
  activeSubSection: SubSection
  onSectionChangeAction: (section: MainSection, subSection: SubSection) => void
}
 
const navItems = [
  {
    id: "design" as const,
    label: "デザインスタジオ",
    sublabel: "画像生成",
    icon: Palette,
    subItems: [
      { id: "design-pop" as const, label: "POP作成", icon: FileText },
      { id: "design-history" as const, label: "作成履歴", icon: BookOpen },
    ],
  },
  {
    id: "inventory" as const,
    label: "在庫AI",
    sublabel: "仕入れ最適化",
    icon: Package,
    subItems: [
      { id: "inventory-main" as const, label: "仕入れ提案", icon: TrendingUp },
      { id: "inventory-procurement" as const, label: "仕入れリスト", icon: Table },
      { id: "inventory-insights" as const, label: "在庫データ分析", icon: BarChart3 },
      { id: "inventory-catalog" as const, label: "商品一覧", icon: BookOpen },
      { id: "inventory-planning" as const, label: "在庫計画早見表", icon: BarChart3 },
      { id: "inventory-ai-advice" as const, label: "AIアドバイス", icon: Bot },
    ],
  },
  {
    id: "data" as const,
    label: "データ",
    sublabel: "登録・編集",
    icon: Upload,
    subItems: [
      { id: "data-main" as const, label: "データ一覧", icon: Table },
      { id: "data-registration" as const, label: "データ登録", icon: Upload },
    ],
  },
  {
    id: "finance" as const,
    label: "ファイナンスフロー",
    sublabel: "予算管理",
    icon: Wallet,
    subItems: [
      { id: "finance-main" as const, label: "キャッシュフロー", icon: TrendingUp },
      { id: "finance-gantt" as const, label: "ガントチャート", icon: Calendar },
    ],
  },
]

export function Sidebar({ activeSection, activeSubSection, onSectionChangeAction }: SidebarProps) {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<MainSection[]>([activeSection])
  const [isHovering, setIsHovering] = useState(false)

  const toggleExpand = (section: MainSection) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleMainClick = (item: (typeof navItems)[0]) => {
    toggleExpand(item.id)
    const defaultSub = item.subItems[0].id
    onSectionChangeAction(item.id, defaultSub)
  }

  const handleSubClick = (mainId: MainSection, subId: SubSection) => {
    onSectionChangeAction(mainId, subId)
  }

  const handleSettingsNavigation = () => {
    router.push("/settings")
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-screen">
      <aside
        className="group/sidebar w-24.5 hover:w-89.5 transition-[width] duration-300 ease-in-out bg-sidebar text-sidebar-foreground flex flex-col h-full overflow-hidden relative z-20 shadow-[4px_0_16px_rgba(0,0,0,0.08)] border-r border-sidebar-border"
        onMouseEnter={() => {
          setIsHovering(true)
          setExpandedSections([activeSection])
        }}
        onMouseLeave={() => {
          setIsHovering(false)
          setExpandedSections([])
        }}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 min-h-13">
            <div className="w-10 h-10 bg-[#345fe1] rounded-lg flex items-center justify-center shrink-0">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-0.5 overflow-hidden w-0 group-hover/sidebar:w-40 opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap pointer-events-none transition-[width,opacity] duration-200 ease-in-out delay-75 min-h-10.5">
              <h1 className="font-bold text-lg">アパレル管理</h1>
              <p className="text-xs text-sidebar-foreground/60">Business Management</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="p-2 lg:p-4 flex-1 overflow-y-auto">
          <p className="text-[11px] font-medium text-sidebar-foreground/50 mb-3 px-2 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-150">
            メインメニュー
          </p>
          <nav>
            <ul className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                const isExpanded = expandedSections.includes(item.id)
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMainClick(item)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors text-left min-h-13",
                        isActive ? "bg-[#345fe1] text-white" : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div className="overflow-hidden w-0 group-hover/sidebar:w-45 opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap pointer-events-none transition-[width,opacity] duration-200 ease-in-out delay-75">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className={cn("text-xs", isActive ? "text-white/70" : "text-sidebar-foreground/50")}>
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover/sidebar:opacity-100 transition-[opacity,width] duration-150 delay-75 w-0 group-hover/sidebar:w-9 flex justify-end">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                            isActive ? "bg-white/10 text-white" : "bg-sidebar-accent text-sidebar-foreground/60",
                          )}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <ul
                        className={cn(
                          "mt-1 ml-2 space-y-1 overflow-hidden transition-[max-height] duration-200 delay-100",
                          isHovering ? "max-h-150" : "max-h-0",
                        )}
                      >
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon
                          const isSubActive = activeSubSection === subItem.id
                          return (
                            <li key={subItem.id}>
                              <button
                                onClick={() => handleSubClick(item.id, subItem.id)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left text-sm min-h-11",
                                  isSubActive
                                    ? "bg-[#345fe1]/10 text-[#345fe1] font-medium"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent",
                                )}
                              >
                                <SubIcon className="w-4 h-4" />
                                <span className="overflow-hidden w-0 group-hover/sidebar:w-42.5 opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap pointer-events-none transition-[width,opacity] duration-200 ease-in-out delay-75">
                                  {subItem.label}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Preferences */}
        <div className="p-3 lg:p-4">
          <p className="text-xs font-medium text-sidebar-foreground/50 mb-3 px-2 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-150">
            設定
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={handleSettingsNavigation}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors text-left"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm overflow-hidden w-0 group-hover/sidebar:w-30 opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap pointer-events-none transition-[width,opacity] duration-200 ease-in-out delay-75">
                  設定
                </span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors text-left">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm overflow-hidden w-0 group-hover/sidebar:w-30 opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap pointer-events-none transition-[width,opacity] duration-200 ease-in-out delay-75">
                  ヘルプ
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/professional-japanese-business-person-avatar.jpg"
                alt="ユーザーアバター"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm overflow-hidden w-0 group-hover/sidebar:w-35 opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap pointer-events-none transition-[width,opacity] duration-200 ease-in-out delay-75">
                <p className="font-medium">山田 太郎</p>
                <p className="text-xs text-sidebar-foreground/50">店長</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors hidden group-hover/sidebar:inline-flex"
            >
              <LogOut className="w-4 h-4 text-sidebar-foreground/60" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">山田 太郎</span>
          <span className="text-xs text-muted-foreground">管理者</span>
        </div>
      </div>
    </header>
  )
}
