import { prisma } from "@/src/lib/prisma"

// ── システム設定キー定数 ────────────────────────────────────────────────────
export const SYSTEM_SETTING_KEYS = {
  INVENTORY_TURNOVER_PERIOD_MONTHS: "inventory_turnover_period_months",
} as const

export type CategoryDTO = {
  id: string
  categoryCode: string | null
  name: string
  sellThroughDays: number
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const rows = await prisma.productCategory.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
  })
  return rows.map((c) => ({ id: c.id, categoryCode: c.categoryCode, name: c.name, sellThroughDays: c.sellThroughDays }))
}

export async function createCategory(
  name: string,
  sellThroughDays: number,
  categoryCode?: string | null,
): Promise<CategoryDTO> {
  const c = await prisma.productCategory.create({
    data: { name, sellThroughDays, categoryCode: categoryCode ?? null },
  })
  return { id: c.id, categoryCode: c.categoryCode, name: c.name, sellThroughDays: c.sellThroughDays }
}

export async function updateCategory(
  id: string,
  name: string,
  sellThroughDays: number,
  categoryCode?: string | null,
): Promise<CategoryDTO> {
  const c = await prisma.productCategory.update({
    where: { id },
    data: { name, sellThroughDays, categoryCode: categoryCode ?? null },
  })
  return { id: c.id, categoryCode: c.categoryCode, name: c.name, sellThroughDays: c.sellThroughDays }
}

// ── システム設定 ──────────────────────────────────────────────────────────────

export async function getSystemSetting(key: string): Promise<string | null> {
  const row = await prisma.systemSetting.findUnique({ where: { key } })
  return row?.value ?? null
}

export async function setSystemSetting(key: string, value: string): Promise<void> {
  await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
}

export async function getInventoryTurnoverPeriodMonths(): Promise<number> {
  const val = await getSystemSetting(SYSTEM_SETTING_KEYS.INVENTORY_TURNOVER_PERIOD_MONTHS)
  const parsed = val ? Number(val) : NaN
  return isNaN(parsed) ? 12 : parsed
}

export async function setInventoryTurnoverPeriodMonths(months: number): Promise<void> {
  await setSystemSetting(SYSTEM_SETTING_KEYS.INVENTORY_TURNOVER_PERIOD_MONTHS, String(months))
}

export async function deleteCategory(
  id: string,
): Promise<{ success: boolean; reason?: string }> {
  const count = await prisma.product.count({ where: { categoryId: id } })
  if (count > 0) {
    return {
      success: false,
      reason: `このカテゴリを参照している商品が ${count} 件あるため削除できません。`,
    }
  }
  await prisma.productCategory.update({ where: { id }, data: { deletedAt: new Date() } })
  return { success: true }
}
