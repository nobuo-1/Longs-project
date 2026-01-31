"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, FileText, Table } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { dataSets } from "@/lib/data-sets"
import { useDataStore } from "@/hooks/use-data-store"
import { cn } from "@/lib/utils"

type DisplayRow = Record<string, string | number> & {
  __rowId: string
  __sourceIndex: number
}

export function DataHub() {
  const [activeDatasetId, setActiveDatasetId] = useState(dataSets[0]?.id ?? "")
  const { rowsByDataset, setRowsByDataset } = useDataStore()
  const dataSetMap = useMemo(() => Object.fromEntries(dataSets.map((set) => [set.id, set])), [])
  const activeDataSet = dataSetMap[activeDatasetId]
  const [searchTerm, setSearchTerm] = useState("")
  const [pageSize, setPageSize] = useState(50)
  const [page, setPage] = useState(1)

  const [editing, setEditing] = useState<{ datasetId: string; rowIndex: number } | null>(null)
  const [editDraft, setEditDraft] = useState<Record<string, string>>({})
  const formatValue = (value: string | number | undefined) => {
    if (typeof value === "number") {
      return new Intl.NumberFormat("ja-JP").format(value)
    }
    return value ?? "-"
  }

  const datasetCounts = useMemo(
    () =>
      dataSets.reduce((acc, set) => {
        const baseCount = rowsByDataset[set.id]?.length ?? 0
        acc[set.id] = baseCount === 0 ? 0 : Math.max(baseCount, 1200)
        return acc
      }, {} as Record<string, number>),
    [rowsByDataset],
  )

  const expandedRows = useMemo<DisplayRow[]>(() => {
    if (!activeDataSet) return []
    const baseRows = rowsByDataset[activeDataSet.id] ?? []
    if (baseRows.length === 0) return []
    const targetCount = Math.max(baseRows.length, 1200)
    return Array.from({ length: targetCount }, (_, index) => {
      const sourceIndex = index % baseRows.length
      return {
        ...baseRows[sourceIndex],
        __rowId: `${activeDataSet.id}-${index + 1}`,
        __sourceIndex: sourceIndex,
      }
    })
  }, [activeDataSet?.id, rowsByDataset])

  const filteredRows = useMemo<DisplayRow[]>(() => {
    if (!activeDataSet) return []
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return expandedRows
    return expandedRows.filter((row) =>
      activeDataSet.previewColumns.some((col) => String(row[col] ?? "").toLowerCase().includes(keyword)),
    )
  }, [activeDataSet, expandedRows, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageRows = filteredRows.slice(pageStart, pageStart + pageSize)
  const pageEnd = pageStart + pageRows.length

  useEffect(() => {
    setPage(1)
  }, [activeDatasetId, searchTerm, pageSize])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const openEdit = (datasetId: string, rowIndex: number) => {
    const dataSet = dataSetMap[datasetId]
    const row = rowsByDataset[datasetId]?.[rowIndex] || {}
    const draft = dataSet.columns.reduce((acc, col) => {
      acc[col] = row[col] === undefined ? "" : String(row[col])
      return acc
    }, {} as Record<string, string>)
    setEditDraft(draft)
    setEditing({ datasetId, rowIndex })
  }

  const saveEdit = () => {
    if (!editing) return
    const { datasetId, rowIndex } = editing
    setRowsByDataset((prev) => {
      const next = { ...prev }
      const rows = [...(next[datasetId] ?? [])]
      rows[rowIndex] = { ...rows[rowIndex], ...editDraft }
      next[datasetId] = rows
      return next
    })
    setEditing(null)
  }

  const deleteRow = (datasetId: string, rowIndex: number) => {
    setRowsByDataset((prev) => {
      const next = { ...prev }
      const rows = [...(next[datasetId] ?? [])]
      if (rowIndex >= 0 && rowIndex < rows.length) {
        rows.splice(rowIndex, 1)
      }
      next[datasetId] = rows
      return next
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Data</p>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Table className="w-6 h-6 text-[#345fe1]" />
            データ一覧
          </h2>
          <p className="text-muted-foreground">
            アップロード済みデータの確認と編集をまとめて行えます。
          </p>
        </div>
        <Button variant="outline" className="text-[#345fe1] border-[#345fe1]">
          <Download className="w-4 h-4 mr-2 text-[#345fe1]" />
          CSV出力（ダミー）
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">データセット</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dataSets.map((set) => {
              const isActive = set.id === activeDatasetId
              const rows = datasetCounts[set.id] ?? 0
              return (
                <button
                  key={set.id}
                  onClick={() => setActiveDatasetId(set.id)}
                  className={cn(
                    "w-full text-left rounded-xl border px-3 py-2 transition-colors",
                    isActive
                      ? "border-[#345fe1] bg-[#345fe1]/10 text-[#345fe1]"
                      : "border-border text-muted-foreground hover:border-[#345fe1]/50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{set.name}</span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", isActive && "border-[#345fe1] text-[#345fe1]")}
                    >
                      {formatValue(rows)}行
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{set.description}</p>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#345fe1]" />
                {activeDataSet?.name ?? "データ"}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{activeDataSet?.description}</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {activeDataSet ? `全 ${formatValue(expandedRows.length)} 行` : "0 行"}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {!activeDataSet ? (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                データセットがありません。
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="キーワードで検索"
                      className="w-55"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>表示行数</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border border-border rounded-md px-2 py-1 bg-white text-xs"
                      >
                        {[50, 100, 200].map((size) => (
                          <option key={size} value={size}>
                            {size}行
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatValue(filteredRows.length)} 件 / 全 {formatValue(expandedRows.length)} 件
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-auto rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white sticky top-0 z-20 shadow-sm">
                      <tr>
                        {activeDataSet.previewColumns.map((col) => (
                          <th key={col} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                            {col}
                          </th>
                        ))}
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row, index) => (
                        <tr key={row.__rowId ?? `${activeDataSet.id}-${pageStart + index}`} className="border-t border-border/70">
                          {activeDataSet.previewColumns.map((col) => (
                            <td key={`${row.__rowId}-${col}`} className="px-3 py-2 text-xs text-muted-foreground">
                              {formatValue(row[col])}
                            </td>
                          ))}
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(activeDataSet.id, row.__sourceIndex ?? 0)}
                            >
                              編集
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
                              onClick={() => deleteRow(activeDataSet.id, row.__sourceIndex ?? 0)}
                            >
                              削除
                            </Button>
                          </div>
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>
                    {filteredRows.length === 0 ? "0" : `${formatValue(pageStart + 1)} - ${formatValue(pageEnd)}`} /{" "}
                    {formatValue(filteredRows.length)} 行
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      前へ
                    </Button>
                    <span>
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      次へ
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={(open: boolean) => !open && setEditing(null)}>
        <DialogContent className="max-w-5xl w-[92vw]">
          <DialogHeader>
            <DialogTitle>データ編集</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4 text-[#345fe1]" />
                <span>{dataSetMap[editing.datasetId]?.name}</span>
              </div>
              <div className="max-h-[60vh] overflow-auto rounded-lg border border-border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataSetMap[editing.datasetId]?.columns.map((col) => (
                    <div key={col} className="space-y-2">
                      <Label className="text-xs text-muted-foreground">{col}</Label>
                      <Input value={editDraft[col] ?? ""} onChange={(e) => setEditDraft((prev) => ({ ...prev, [col]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  キャンセル
                </Button>
                <Button className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white" onClick={saveEdit}>
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
