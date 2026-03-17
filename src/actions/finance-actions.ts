"use server"

import { getGanttEntries } from "@/src/services/finance-service"

export type GanttEntryDTO = {
  id: string
  partner: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  cycle: string
  offsetMonths: number
  day: number
  tags: string[]
  seasonality: number[]
  isFixed: boolean
}

export async function getGanttEntriesAction(): Promise<
  { success: true; data: GanttEntryDTO[] } | { success: false; error: string }
> {
  try {
    const rows = await getGanttEntries()
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        partner: r.partner,
        description: r.description,
        amount: Number(r.amountYen),
        type: r.flow,
        category: r.category,
        cycle: r.cycle ?? "",
        offsetMonths: r.offsetMonths,
        day: r.dueDay,
        tags: r.tags,
        seasonality: r.seasonality,
        isFixed: r.isFixed,
      })),
    }
  } catch (e) {
    console.error("[getGanttEntriesAction]", e)
    return { success: false, error: "ガントデータの取得に失敗しました" }
  }
}
