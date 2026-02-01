"use client"

import { useMemo, useState } from "react"
import { Upload, Download, Table, ChevronRight, AlertTriangle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { dataSets } from "@/lib/data-sets"
import { cn } from "@/lib/utils"

type ImportState = {
  uploading: boolean
  progress: number
  lastImportedAt?: string
}

type ImportHistory = {
  id: string
  fileName: string
  importedAt: string
  rows: number
  status: "success" | "partial" | "failed"
  note?: string
  summary: string
  stats: {
    processed: number
    success: number
    skipped: number
    warnings: number
    errors: number
  }
  warnings?: string[]
  errors?: string[]
}

type HistoryDialogState = {
  datasetId: string
  datasetName: string
  datasetDescription: string
  history: ImportHistory
}

const statusLabels: Record<ImportHistory["status"], string> = {
  success: "取込完了",
  partial: "一部注意",
  failed: "失敗",
}

const importHistoryByDataset: Record<string, ImportHistory[]> = {
  sales: [
    {
      id: "sales-2024-12",
      fileName: "sales_2024-12.csv",
      importedAt: "2024/12/20 10:30",
      rows: 12450,
      status: "success",
      summary: "全レコードが正常に取り込まれました。",
      stats: { processed: 12450, success: 12450, skipped: 0, warnings: 0, errors: 0 },
    },
    {
      id: "sales-2024-11",
      fileName: "sales_2024-11.csv",
      importedAt: "2024/11/25 09:12",
      rows: 11980,
      status: "success",
      summary: "売上データを問題なく取り込みました。",
      stats: { processed: 11980, success: 11980, skipped: 0, warnings: 0, errors: 0 },
    },
  ],
  payables: [
    {
      id: "payables-2024-12",
      fileName: "payables_2024-12.xlsx",
      importedAt: "2024/12/18 14:02",
      rows: 3580,
      status: "success",
      summary: "支払い予定データが正常に取り込まれました。",
      stats: { processed: 3580, success: 3580, skipped: 0, warnings: 0, errors: 0 },
    },
    {
      id: "payables-2024-11",
      fileName: "payables_2024-11.xlsx",
      importedAt: "2024/11/20 13:50",
      rows: 3400,
      status: "partial",
      note: "数行の欠損あり",
      summary: "一部欠損行を除外して取り込みました。",
      stats: { processed: 3400, success: 3380, skipped: 20, warnings: 2, errors: 0 },
      warnings: ["仕入先コードが未設定の行が20件ありスキップしました。", "日付形式の揺れが2件あり自動補正しました。"],
    },
  ],
  receivables: [
    {
      id: "receivables-2024-12",
      fileName: "receivables_2024-12.csv",
      importedAt: "2024/12/19 16:20",
      rows: 6720,
      status: "success",
      summary: "入金予定データを問題なく取り込みました。",
      stats: { processed: 6720, success: 6720, skipped: 0, warnings: 0, errors: 0 },
    },
    {
      id: "receivables-2024-11",
      fileName: "receivables_2024-11.csv",
      importedAt: "2024/11/22 11:05",
      rows: 6550,
      status: "success",
      summary: "入金予定データを問題なく取り込みました。",
      stats: { processed: 6550, success: 6550, skipped: 0, warnings: 0, errors: 0 },
    },
  ],
  "gross-profit": [
    {
      id: "gross-profit-2024",
      fileName: "profit_2024.csv",
      importedAt: "2024/12/10 08:45",
      rows: 980,
      status: "success",
      summary: "年度粗利データが正常に取り込まれました。",
      stats: { processed: 980, success: 980, skipped: 0, warnings: 0, errors: 0 },
    },
    {
      id: "gross-profit-2023",
      fileName: "profit_2023.csv",
      importedAt: "2024/11/01 08:45",
      rows: 960,
      status: "failed",
      note: "フォーマット不一致",
      summary: "フォーマット不一致のため取り込みに失敗しました。",
      stats: { processed: 960, success: 0, skipped: 0, warnings: 0, errors: 3 },
      errors: [
        "列数が想定と一致しません（期待: 12列 / 実際: 9列）。",
        "必須列「gross_margin」が見つかりません。",
        "日付列「month」がYYYY-MM形式ではありません。",
      ],
    },
  ],
}

export function DataRegistration() {
  const dataSetMap = useMemo(() => Object.fromEntries(dataSets.map((set) => [set.id, set])), [])
  const [importTargetId, setImportTargetId] = useState<string | null>(null)
  const [importFileName, setImportFileName] = useState("")
  const [isDragActive, setIsDragActive] = useState(false)
  const [activeHistory, setActiveHistory] = useState<HistoryDialogState | null>(null)
  const [importStates, setImportStates] = useState<Record<string, ImportState>>(() =>
    dataSets.reduce((acc, set) => {
      acc[set.id] = { uploading: false, progress: 0, lastImportedAt: "2024/12/20 10:30" }
      return acc
    }, {} as Record<string, ImportState>),
  )

  const formatValue = (value: string | number | undefined) => {
    if (typeof value === "number") {
      return new Intl.NumberFormat("ja-JP").format(value)
    }
    return value ?? "-"
  }

  const startImport = (datasetId: string) => {
    setImportStates((prev) => ({
      ...prev,
      [datasetId]: { ...prev[datasetId], uploading: true, progress: 0 },
    }))

    const interval = setInterval(() => {
      setImportStates((prev) => {
        const current = prev[datasetId]
        if (!current) return prev
        const nextProgress = Math.min(100, current.progress + 10)
        const nextState = {
          ...prev,
          [datasetId]: {
            ...current,
            progress: nextProgress,
            uploading: nextProgress < 100,
            lastImportedAt: nextProgress >= 100 ? new Date().toLocaleString("ja-JP") : current.lastImportedAt,
          },
        }
        if (nextProgress >= 100) {
          clearInterval(interval)
        }
        return nextState
      })
    }, 200)
  }

  const activeImportSet = importTargetId ? dataSetMap[importTargetId] : null

  const handleImportConfirm = () => {
    if (!importTargetId) return
    startImport(importTargetId)
    setImportTargetId(null)
    setImportFileName("")
  }

  const handleFileSelect = (file?: File | null) => {
    if (!file) return
    setImportFileName(file.name)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Data</p>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6 text-[#345fe1]" />
          データ登録
        </h2>
        <p className="text-muted-foreground">売上・仕入・請求・年度粗利データを個別にアップロード/編集できます。</p>
      </div>

      <div className="space-y-6">
        {dataSets.map((set) => {
          const importState = importStates[set.id]
          const histories = importHistoryByDataset[set.id] ?? []
          return (
            <Card key={set.id}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Table className="w-4 h-4 text-[#345fe1]" />
                      {set.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{set.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">最終アップロード {importState.lastImportedAt}</span>
                    <Button variant="outline" className="text-[#345fe1] border-[#345fe1]">
                      <Download className="w-4 h-4 mr-2 text-[#345fe1]" />
                      テンプレート
                    </Button>
                    <Button
                      onClick={() => setImportTargetId(set.id)}
                      className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white"
                      disabled={importState.uploading}
                    >
                      <Upload className="w-4 h-4 mr-2 text-white" />
                      {importState.uploading ? "アップロード中..." : "アップロード"}
                    </Button>
                  </div>
                </div>
                {importState.uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>アップロード進行状況</span>
                      <span>{importState.progress}%</span>
                    </div>
                    <Progress value={importState.progress} className="h-2" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border/70 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/40">
                    <p className="text-xs text-muted-foreground">アップロード履歴</p>
                    <p className="text-xs text-muted-foreground">履歴件数 {formatValue(histories.length)} 件</p>
                  </div>
                  {histories.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">アップロード履歴がありません。</div>
                  ) : (
                    <div className="divide-y divide-border/70">
                      {histories.map((history) => (
                        <button
                          key={history.id}
                          type="button"
                          onClick={() =>
                            setActiveHistory({
                              datasetId: set.id,
                              datasetName: set.name,
                              datasetDescription: set.description,
                              history,
                            })
                          }
                          className="w-full text-left px-3 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345fe1]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{history.fileName}</p>
                              <p className="text-xs text-muted-foreground">{history.importedAt}</p>
                              {history.note && <p className="text-xs text-muted-foreground">{history.note}</p>}
                            </div>
                            <div className="flex items-center gap-3 text-right">
                              <div>
                                <p className="text-sm font-semibold text-foreground">{formatValue(history.rows)} 行</p>
                                <p
                                  className={cn(
                                    "text-xs font-medium",
                                    history.status === "success"
                                      ? "text-[#345fe1]"
                                      : history.status === "partial"
                                        ? "text-amber-600"
                                        : "text-red-600",
                                  )}
                                >
                                  {statusLabels[history.status]}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground mb-2">アップロード予定カラム</p>
                  <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                    {set.columns.map((col) => (
                      <span key={`${set.id}-${col}`} className="px-2 py-1 rounded-md bg-white">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog
        open={!!importTargetId}
        onOpenChange={(open) => {
          if (!open) {
            setImportTargetId(null)
            setImportFileName("")
            setIsDragActive(false)
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>データをアップロード</DialogTitle>
            <DialogDescription>対象データにアップロードするファイルを選択してください。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-border p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">{activeImportSet?.name ?? "データセット"}</p>
              <p className="text-xs text-muted-foreground">{activeImportSet?.description}</p>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragActive(true)
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragActive(false)
                  handleFileSelect(e.dataTransfer.files?.[0])
                }}
                className={cn(
                  "rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
                  isDragActive ? "border-[#345fe1] bg-[#345fe1]/10" : "border-border bg-muted/20",
                )}
              >
                <Upload className="w-8 h-8 mx-auto text-[#345fe1] mb-2" />
                <p className="text-sm font-medium">ファイルをドラッグ＆ドロップ</p>
                <p className="text-xs text-muted-foreground">またはクリックして選択</p>
                <label className="inline-flex mt-3">
                  <span className="px-3 py-1.5 text-xs rounded-full border border-[#345fe1] text-[#345fe1] cursor-pointer">
                    ファイルを選択
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                </label>
              </div>
              {importFileName && <p className="text-xs text-muted-foreground">選択中: {importFileName}</p>}
              <p className="text-[11px] text-muted-foreground">CSV / XLSX 対応（ダミー）</p>
            </div>
            {activeImportSet && (
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-2">アップロード予定カラム</p>
                <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                  {activeImportSet.columns.map((col) => (
                    <span key={col} className="px-2 py-1 rounded-md bg-white">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImportTargetId(null)}>
                キャンセル
              </Button>
              <Button className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" onClick={handleImportConfirm}>
                アップロード開始
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!activeHistory}
        onOpenChange={(open) => {
          if (!open) {
            setActiveHistory(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>アップロード履歴の詳細</DialogTitle>
            <DialogDescription>
              {activeHistory?.datasetName} / {activeHistory?.history.fileName}
              {activeHistory?.datasetDescription ? ` • ${activeHistory.datasetDescription}` : ""}
            </DialogDescription>
          </DialogHeader>
          {activeHistory && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">アップロード日時</p>
                    <p className="text-sm font-medium text-foreground">{activeHistory.history.importedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ステータス</p>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        activeHistory.history.status === "success"
                          ? "text-[#345fe1]"
                          : activeHistory.history.status === "partial"
                            ? "text-amber-600"
                            : "text-red-600",
                      )}
                    >
                      {statusLabels[activeHistory.history.status]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">取込行数</p>
                    <p className="text-sm font-semibold text-foreground">{formatValue(activeHistory.history.rows)} 行</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">概要</p>
                  <p className="text-sm text-foreground">{activeHistory.history.summary}</p>
                  {activeHistory.history.note && (
                    <p className="text-xs text-muted-foreground mt-1">補足: {activeHistory.history.note}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">処理対象</p>
                  <p className="text-sm font-semibold text-foreground">{formatValue(activeHistory.history.stats.processed)}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">正常</p>
                  <p className="text-sm font-semibold text-[#345fe1]">{formatValue(activeHistory.history.stats.success)}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">スキップ</p>
                  <p className="text-sm font-semibold text-foreground">{formatValue(activeHistory.history.stats.skipped)}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">注意</p>
                  <p className="text-sm font-semibold text-amber-600">
                    {formatValue(activeHistory.history.stats.warnings)}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">エラー</p>
                  <p className="text-sm font-semibold text-red-600">{formatValue(activeHistory.history.stats.errors)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <p className="text-sm font-semibold text-foreground">注意 / 警告</p>
                  </div>
                  {activeHistory.history.warnings?.length ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {activeHistory.history.warnings.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">注意事項はありません。</p>
                  )}
                </div>
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm font-semibold text-foreground">エラー詳細</p>
                  </div>
                  {activeHistory.history.errors?.length ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {activeHistory.history.errors.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">エラーはありません。</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
