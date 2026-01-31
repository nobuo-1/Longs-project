"use client"

import { useEffect, useState } from "react"
import { dataSets } from "@/lib/data-sets"

const STORAGE_KEY = "apparel-data-store"

type DataRow = Record<string, string | number>

type RowsByDataset = Record<string, DataRow[]>

const buildInitialRows = (): RowsByDataset =>
  dataSets.reduce((acc, set) => {
    acc[set.id] = set.rows
    return acc
  }, {} as RowsByDataset)

const parseStoredRows = (raw: string | null): RowsByDataset | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as RowsByDataset
    if (!parsed || typeof parsed !== "object") return null
    const next: RowsByDataset = {}
    dataSets.forEach((set) => {
      const rows = parsed[set.id]
      next[set.id] = Array.isArray(rows) ? rows : set.rows
    })
    return next
  } catch {
    return null
  }
}

export function useDataStore() {
  const [rowsByDataset, setRowsByDataset] = useState<RowsByDataset>(() => buildInitialRows())

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = parseStoredRows(window.localStorage.getItem(STORAGE_KEY))
    if (stored) {
      setRowsByDataset(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rowsByDataset))
  }, [rowsByDataset])

  return { rowsByDataset, setRowsByDataset }
}
