"use server"

import { requireRole } from "@/src/lib/permissions"
import * as svc from "@/src/services/advice-service"
import type { FactorQueryConfigDTO, WeeklyFactorAnalysisDTO, FactorType } from "@/src/services/advice-service"

export type { FactorQueryConfigDTO, WeeklyFactorAnalysisDTO, FactorType }

// ─── FactorQueryConfig ────────────────────────────────────────

export async function getFactorConfigsAction(): Promise<
  { success: true; data: FactorQueryConfigDTO[] } | { success: false; error: string }
> {
  try {
    await requireRole(["admin", "manager"])
    const data = await svc.getFactorConfigs()
    return { success: true, data }
  } catch (e) {
    if (e instanceof Error && (e.message === "認証が必要です" || e.message === "権限がありません")) {
      return { success: false, error: e.message }
    }
    console.error("[getFactorConfigsAction]", e)
    return { success: false, error: "設定の取得に失敗しました" }
  }
}

export async function addFactorConfigAction(
  factorType: FactorType,
  queryGroupId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await requireRole(["admin", "manager"])
    await svc.addFactorConfig(factorType, queryGroupId)
    return { success: true }
  } catch (e) {
    if (e instanceof Error && (e.message === "認証が必要です" || e.message === "権限がありません")) {
      return { success: false, error: e.message }
    }
    console.error("[addFactorConfigAction]", e)
    return { success: false, error: "設定の保存に失敗しました" }
  }
}

export async function removeFactorConfigAction(
  factorType: FactorType,
  queryGroupId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await requireRole(["admin", "manager"])
    await svc.removeFactorConfig(factorType, queryGroupId)
    return { success: true }
  } catch (e) {
    if (e instanceof Error && (e.message === "認証が必要です" || e.message === "権限がありません")) {
      return { success: false, error: e.message }
    }
    console.error("[removeFactorConfigAction]", e)
    return { success: false, error: "設定の削除に失敗しました" }
  }
}

// ─── WeeklyFactorAnalysis ─────────────────────────────────────

export async function getWeeklyFactorAnalysesAction(
  weekStartIso: string,
): Promise<{ success: true; data: WeeklyFactorAnalysisDTO[] } | { success: false; error: string }> {
  try {
    await requireRole(["admin", "manager"])
    const data = await svc.getWeeklyFactorAnalyses(new Date(weekStartIso))
    return { success: true, data }
  } catch (e) {
    if (e instanceof Error && (e.message === "認証が必要です" || e.message === "権限がありません")) {
      return { success: false, error: e.message }
    }
    console.error("[getWeeklyFactorAnalysesAction]", e)
    return { success: false, error: "分析結果の取得に失敗しました" }
  }
}

export async function runWeeklyFactorAnalysisAction(
  weekStartIso: string,
): Promise<{ success: true; data: WeeklyFactorAnalysisDTO[] } | { success: false; error: string }> {
  try {
    await requireRole(["admin", "manager"])
    const data = await svc.runWeeklyFactorAnalysis(new Date(weekStartIso))
    return { success: true, data }
  } catch (e) {
    if (e instanceof Error && (e.message === "認証が必要です" || e.message === "権限がありません")) {
      return { success: false, error: e.message }
    }
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    console.error("[runWeeklyFactorAnalysisAction]", e)
    return { success: false, error: "分析の実行に失敗しました" }
  }
}
