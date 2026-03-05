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
): Promise<
  { success: true; data: settingsService.CategoryDTO } | { success: false; error: string }
> {
  try {
    if (!name.trim()) return { success: false, error: "カテゴリ名を入力してください" }
    if (sellThroughDays < 1) return { success: false, error: "売り切り日数は1以上で入力してください" }
    const data = await settingsService.createCategory(name.trim(), sellThroughDays)
    return { success: true, data }
  } catch (e: any) {
    if (e?.code === "P2002") return { success: false, error: "同じ名前のカテゴリが既に存在します" }
    console.error("[createCategoryAction]", e)
    return { success: false, error: "カテゴリの作成に失敗しました" }
  }
}

export async function updateCategoryAction(
  id: string,
  name: string,
  sellThroughDays: number,
): Promise<
  { success: true; data: settingsService.CategoryDTO } | { success: false; error: string }
> {
  try {
    if (!name.trim()) return { success: false, error: "カテゴリ名を入力してください" }
    if (sellThroughDays < 1) return { success: false, error: "売り切り日数は1以上で入力してください" }
    const data = await settingsService.updateCategory(id, name.trim(), sellThroughDays)
    return { success: true, data }
  } catch (e: any) {
    if (e?.code === "P2002") return { success: false, error: "同じ名前のカテゴリが既に存在します" }
    console.error("[updateCategoryAction]", e)
    return { success: false, error: "カテゴリの更新に失敗しました" }
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
