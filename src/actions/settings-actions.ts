"use server"

import * as settingsService from "@/src/services/settings-service"

export type { CategoryDTO } from "@/src/services/settings-service"

export async function getCategoriesAction(): Promise<
  { success: true; data: settingsService.CategoryDTO[] } | { success: false; error: string }
> {
  try {
    const data = await settingsService.getCategories()
    return { success: true, data }
  } catch (e) {
    console.error("[getCategoriesAction]", e)
    return { success: false, error: "カテゴリの取得に失敗しました" }
  }
}

export async function createCategoryAction(
  name: string,
  sellThroughDays: number,
  categoryCode?: string | null,
): Promise<
  { success: true; data: settingsService.CategoryDTO } | { success: false; error: string }
> {
  try {
    if (!name.trim()) return { success: false, error: "カテゴリ名を入力してください" }
    if (sellThroughDays < 1) return { success: false, error: "売り切り日数は1以上で入力してください" }
    const code = categoryCode?.trim() || null
    const data = await settingsService.createCategory(name.trim(), sellThroughDays, code)
    return { success: true, data }
  } catch (e: any) {
    if (e?.code === "P2002") return { success: false, error: "同じ名前またはカテゴリコードが既に存在します" }
    console.error("[createCategoryAction]", e)
    return { success: false, error: "カテゴリの作成に失敗しました" }
  }
}

export async function updateCategoryAction(
  id: string,
  name: string,
  sellThroughDays: number,
  categoryCode?: string | null,
): Promise<
  { success: true; data: settingsService.CategoryDTO } | { success: false; error: string }
> {
  try {
    if (!name.trim()) return { success: false, error: "カテゴリ名を入力してください" }
    if (sellThroughDays < 1) return { success: false, error: "売り切り日数は1以上で入力してください" }
    const code = categoryCode?.trim() || null
    const data = await settingsService.updateCategory(id, name.trim(), sellThroughDays, code)
    return { success: true, data }
  } catch (e: any) {
    if (e?.code === "P2002") return { success: false, error: "同じ名前またはカテゴリコードが既に存在します" }
    console.error("[updateCategoryAction]", e)
    return { success: false, error: "カテゴリの更新に失敗しました" }
  }
}

export async function getInventoryTurnoverPeriodAction(): Promise<
  { success: true; months: number } | { success: false; error: string }
> {
  try {
    const months = await settingsService.getInventoryTurnoverPeriodMonths()
    return { success: true, months }
  } catch (e) {
    console.error("[getInventoryTurnoverPeriodAction]", e)
    return { success: false, error: "設定の取得に失敗しました" }
  }
}

export async function setInventoryTurnoverPeriodAction(
  months: number,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const valid = [1, 3, 6, 12]
    if (!valid.includes(months)) return { success: false, error: "無効な期間です" }
    await settingsService.setInventoryTurnoverPeriodMonths(months)
    return { success: true }
  } catch (e) {
    console.error("[setInventoryTurnoverPeriodAction]", e)
    return { success: false, error: "設定の保存に失敗しました" }
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await settingsService.deleteCategory(id)
    if (!result.success) return { success: false, error: result.reason }
    return { success: true }
  } catch (e) {
    console.error("[deleteCategoryAction]", e)
    return { success: false, error: "カテゴリの削除に失敗しました" }
  }
}
