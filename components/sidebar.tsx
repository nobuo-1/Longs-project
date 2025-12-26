"use client"

import { useState } from "react"
import Link from "next/link"
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
  ImageIcon,
  FileText,
  BarChart3,
  Table,
  BookOpen,
  TrendingUp,
  PiggyBank,
  Calendar,
  Bot,
  Upload,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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

interface SidebarProps {
  activeSection: MainSection
  activeSubSection: SubSection
  onSectionChange: (section: MainSection, subSection: SubSection) => void
}

const navItems = [
  {
    id: "design" as const,
    label: "デザインスタジオ",
    sublabel: "画像生成",
    icon: Palette,
    subItems: [
      { id: "design-main" as const, label: "デザイン作成", icon: ImageIcon },
      { id: "design-pop" as const, label: "POP作成", icon: FileText },
      { id: "design-poster" as const, label: "ポスター作成", icon: BarChart3 },
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
      { id: "inventory-table" as const, label: "在庫一覧表", icon: Table },
      { id: "inventory-catalog" as const, label: "商品カタログ", icon: BookOpen },
      { id: "inventory-planning" as const, label: "在庫計画早見表", icon: BarChart3 },
      { id: "inventory-ai-advice" as const, label: "AIアドバイス", icon: Bot },
      { id: "inventory-import" as const, label: "データインポート", icon: Upload },
      { id: "inventory-alerts" as const, label: "在庫アラート", icon: AlertTriangle },
    ],
  },
  {
    id: "finance" as const,
    label: "ファイナンスフロー",
    sublabel: "予算管理",
    icon: Wallet,
    subItems: [
      { id: "finance-main" as const, label: "キャッシュフロー", icon: TrendingUp },
      { id: "finance-reserve" as const, label: "内部留保設定", icon: PiggyBank },
      { id: "finance-gantt" as const, label: "ガントチャート", icon: Calendar },
    ],
  },
]

export function Sidebar({ activeSection, activeSubSection, onSectionChange }: SidebarProps) {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<MainSection[]>([activeSection])

  const toggleExpand = (section: MainSection) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleMainClick = (item: (typeof navItems)[0]) => {
    toggleExpand(item.id)
    const defaultSub = item.subItems[0].id
    onSectionChange(item.id, defaultSub)
  }

  const handleSubClick = (mainId: MainSection, subId: SubSection) => {
    onSectionChange(mainId, subId)
  }

  const handleSettingsNavigation = () => {
    router.push("/settings")
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-screen">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-full">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#345fe1] rounded-lg flex items-center justify-center">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">アパレル管理</h1>
              <p className="text-xs text-sidebar-foreground/60">Business Management</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs font-medium text-sidebar-foreground/50 mb-3 px-2">メインメニュー</p>
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                const isExpanded = expandedSections.includes(item.id)
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMainClick(item)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left",
                        isActive ? "bg-[#345fe1] text-white" : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className={cn("text-xs", isActive ? "text-white/70" : "text-sidebar-foreground/50")}>
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown
                          className={cn("w-4 h-4", isActive ? "text-white/70" : "text-sidebar-foreground/50")}
                        />
                      ) : (
                        <ChevronRight
                          className={cn("w-4 h-4", isActive ? "text-white/70" : "text-sidebar-foreground/50")}
                        />
                      )}
                    </button>
                    {isExpanded && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon
                          const isSubActive = activeSubSection === subItem.id
                          return (
                            <li key={subItem.id}>
                              <button
                                onClick={() => handleSubClick(item.id, subItem.id)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left text-sm",
                                  isSubActive
                                    ? "bg-[#345fe1]/10 text-[#345fe1] font-medium"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent",
                                )}
                              >
                                <SubIcon className="w-4 h-4" />
                                <span>{subItem.label}</span>
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
        <div className="p-4">
          <p className="text-xs font-medium text-sidebar-foreground/50 mb-3 px-2">設定</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={handleSettingsNavigation}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors text-left"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm">設定</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors text-left">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm">ヘルプ</span>
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
              <div className="text-sm">
                <p className="font-medium">山田 太郎</p>
                <p className="text-xs text-sidebar-foreground/50">店長</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
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
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Input type="search" placeholder="検索..." className="pl-10 bg-muted/50 border-0" />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/settings" className="text-sm text-[#345fe1] hover:underline hidden sm:inline-block">
          設定
        </Link>
        <Link href="/login" className="text-sm text-muted-foreground hover:text-[#345fe1] hidden sm:inline-block">
          ログイン
        </Link>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src="/professional-japanese-business-person-avatar.jpg"
            alt="ユーザーアバター"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-medium">山田 太郎</span>
        </div>
      </div>
    </header>
  )
}
