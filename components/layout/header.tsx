"use client"

import { Bell } from "lucide-react"
import { getRoleLabel } from "@/src/lib/role-labels"

type UserInfo = { name: string; role: string }

export function Header({ user }: { user: UserInfo }) {
  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{user.name || "（名前未設定）"}</span>
          <span className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</span>
        </div>
      </div>
    </header>
  )
}
