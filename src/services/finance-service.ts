import { prisma } from "@/src/lib/prisma"

export type GanttEntryRow = {
  id: string
  partner: string
  description: string
  amountYen: bigint
  flow: "income" | "expense"
  category: string
  cycle: string | null
  offsetMonths: number
  dueDay: number
  tags: string[]
  seasonality: number[]
  isFixed: boolean
}

export async function getGanttEntries(): Promise<GanttEntryRow[]> {
  const rows = await prisma.recurringEntry.findMany({
    where: { deletedAt: null },
    include: {
      businessPartner: { select: { name: true } },
      tagMaps: { include: { tag: { select: { name: true } } } },
    },
    orderBy: [{ flow: "asc" }, { sortOrder: "asc" }],
  })
  return rows.map((r) => ({
    id: r.id,
    partner: r.businessPartner?.name ?? r.description ?? "",
    description: r.description ?? "",
    amountYen: r.amountYen,
    flow: r.flow as "income" | "expense",
    category: r.category,
    cycle: r.cycle,
    offsetMonths: r.offsetMonths,
    dueDay: r.dueDay,
    tags: r.tagMaps.map((m) => m.tag.name),
    seasonality: r.seasonality.map((d) => Number(d)),
    isFixed: r.businessPartnerId === null,
  }))
}
