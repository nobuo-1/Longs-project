"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Download, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ImportedFile {
  id: number
  name: string
  size: string
  date: string
  status: "success" | "error" | "processing"
  records: number
  errors: number
}

const sampleImportHistory: ImportedFile[] = [
  {
    id: 1,
    name: "inventory_202412.csv",
    size: "2.4 MB",
    date: "2024/12/18 14:32",
    status: "success",
    records: 1250,
    errors: 0,
  },
  {
    id: 2,
    name: "sales_data_q4.csv",
    size: "5.1 MB",
    date: "2024/12/15 09:15",
    status: "success",
    records: 3420,
    errors: 12,
  },
  {
    id: 3,
    name: "supplier_list.csv",
    size: "0.8 MB",
    date: "2024/12/10 16:45",
    status: "error",
    records: 0,
    errors: 156,
  },
  {
    id: 4,
    name: "product_master.csv",
    size: "1.2 MB",
    date: "2024/12/05 11:20",
    status: "success",
    records: 890,
    errors: 3,
  },
]

const csvTemplates = [
  {
    name: "在庫データテンプレート",
    description: "商品コード、在庫数、単価などの基本情報",
    filename: "inventory_template.csv",
  },
  { name: "売上データテンプレート", description: "売上日、商品、数量、金額など", filename: "sales_template.csv" },
  { name: "仕入れデータテンプレート", description: "仕入先、発注数、納品日など", filename: "purchase_template.csv" },
  { name: "商品マスタテンプレート", description: "商品情報の一括登録用", filename: "product_master_template.csv" },
]

export function InventoryImport() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [importHistory, setImportHistory] = useState(sampleImportHistory)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Simulate file upload
    simulateUpload()
  }, [])

  const handleFileSelect = () => {
    // Simulate file upload
    simulateUpload()
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // Add new entry to history
          setImportHistory((prev) => [
            {
              id: Date.now(),
              name: "new_import_" + new Date().toISOString().slice(0, 10) + ".csv",
              size: "1.5 MB",
              date: new Date().toLocaleString("ja-JP"),
              status: "success",
              records: 450,
              errors: 2,
            },
            ...prev,
          ])
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  const deleteImport = (id: number) => {
    setImportHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6 text-[#345fe1]" />
          データインポート
        </h2>
        <p className="text-muted-foreground">CSVファイルから在庫データをインポート</p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
              isDragging
                ? "border-[#345fe1] bg-[#345fe1]/5"
                : "border-border hover:border-[#345fe1]/50 hover:bg-muted/50",
            )}
          >
            <div className="w-16 h-16 bg-[#345fe1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#345fe1]" />
            </div>
            <h3 className="text-lg font-medium mb-2">CSVファイルをドラッグ&ドロップ</h3>
            <p className="text-muted-foreground mb-4">または下のボタンからファイルを選択してください</p>
            <Button
              onClick={handleFileSelect}
              className="bg-[#345fe1] hover:bg-[#2a4bb3] text-white"
              disabled={isUploading}
            >
              {isUploading ? "アップロード中..." : "ファイルを選択"}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">対応形式: CSV, XLSX (最大50MB)</p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">アップロード中...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV Templates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">CSVテンプレート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {csvTemplates.map((template, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#345fe1]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#345fe1]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="w-4 h-4 mr-1" />
                  DL
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">インポート履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {importHistory.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      file.status === "success"
                        ? "bg-green-100"
                        : file.status === "error"
                          ? "bg-red-100"
                          : "bg-yellow-100",
                    )}
                  >
                    {file.status === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : file.status === "error" ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.size} • {file.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="font-medium">{file.records.toLocaleString()}</span>
                      <span className="text-muted-foreground"> レコード</span>
                    </p>
                    {file.errors > 0 && <p className="text-xs text-red-600">{file.errors}件のエラー</p>}
                  </div>
                  <Badge
                    className={cn(
                      file.status === "success"
                        ? "bg-green-100 text-green-700"
                        : file.status === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {file.status === "success" ? "完了" : file.status === "error" ? "失敗" : "処理中"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-600"
                    onClick={() => deleteImport(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
