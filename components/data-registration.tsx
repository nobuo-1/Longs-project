"use client"

import { useMemo, useState } from "react"
import { Upload, Download, Table } from "lucide-react"
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
}

const importHistoryByDataset: Record<string, ImportHistory[]> = {
  sales: [
    {
      id: "sales-2024-12",
      fileName: "sales_2024-12.csv",
      importedAt: "2024/12/20 10:30",
      rows: 12450,
      status: "success",
    },
    {
      id: "sales-2024-11",
      fileName: "sales_2024-11.csv",
      importedAt: "2024/11/25 09:12",
      rows: 11980,
      status: "success",
    },
  ],
  payables: [
    {
      id: "payables-2024-12",
      fileName: "payables_2024-12.xlsx",
      importedAt: "2024/12/18 14:02",
      rows: 3580,
      status: "success",
    },
    {
      id: "payables-2024-11",
      fileName: "payables_2024-11.xlsx",
      importedAt: "2024/11/20 13:50",
      rows: 3400,
      status: "partial",
      note: "数行の欠損あり",
    },
  ],
  receivables: [
    {
      id: "receivables-2024-12",
      fileName: "receivables_2024-12.csv",
      importedAt: "2024/12/19 16:20",
      rows: 6720,
      status: "success",
    },
    {
      id: "receivables-2024-11",
      fileName: "receivables_2024-11.csv",
      importedAt: "2024/11/22 11:05",
      rows: 6550,
      status: "success",
    },
  ],
  "gross-profit": [
    {
      id: "gross-profit-2024",
      fileName: "profit_2024.csv",
      importedAt: "2024/12/10 08:45",
      rows: 980,
      status: "success",
    },
    {
      id: "gross-profit-2023",
      fileName: "profit_2023.csv",
      importedAt: "2024/11/01 08:45",
      rows: 960,
      status: "failed",
      note: "フォーマット不一致",
    },
  ],
}

export function DataRegistration() {
  const dataSetMap = useMemo(() => Object.fromEntries(dataSets.map((set) => [set.id, set])), [])
  const [importTargetId, setImportTargetId] = useState<string | null>(null)
  const [importFileName, setImportFileName] = useState("")
  const [isDragActive, setIsDragActive] = useState(false)
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
                        <div key={history.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{history.fileName}</p>
                            <p className="text-xs text-muted-foreground">{history.importedAt}</p>
                            {history.note && <p className="text-xs text-muted-foreground">{history.note}</p>}
                          </div>
                          <div className="text-right">
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
                              {history.status === "success" ? "取込完了" : history.status === "partial" ? "一部注意" : "失敗"}
                            </p>
                          </div>
                        </div>
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
    </div>
  )
}
