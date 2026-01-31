"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "inventory-procurement-list"

export type ProcurementStatus = "high" | "overstock" | "normal"

export type ProcurementItem = {
  id: string
  name: string
  category: string
  manufacturer: string
  currentStock: number
  suggestedOrder: number
  status: ProcurementStatus
  price: number
  orderQty: number
  addedAt: string
}

type ProcurementInput = Omit<ProcurementItem, "orderQty" | "addedAt"> & { orderQty?: number }

const defaultProcurementItems: ProcurementItem[] = [
  {
    id: "SKU001",
    name: "春物ジャケット（ネイビー）",
    category: "アウター",
    manufacturer: "TOKYO BRAND",
    currentStock: 12,
    suggestedOrder: 30,
    status: "high",
    price: 15800,
    orderQty: 30,
    addedAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "SKU004",
    name: "リネンシャツ（ベージュ）",
    category: "シャツ",
    manufacturer: "SUMMER LINE",
    currentStock: 8,
    suggestedOrder: 40,
    status: "high",
    price: 6800,
    orderQty: 36,
    addedAt: "2025-01-12T11:30:00Z",
  },
  {
    id: "SKU008",
    name: "カシミアニット（グレー）",
    category: "トップス",
    manufacturer: "LUXURY KNIT",
    currentStock: 15,
    suggestedOrder: 25,
    status: "high",
    price: 18500,
    orderQty: 25,
    addedAt: "2025-01-15T14:20:00Z",
  },
]

const parseStoredItems = (raw: string | null): ProcurementItem[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as ProcurementItem[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        ...item,
        orderQty: typeof item.orderQty === "number" ? item.orderQty : item.suggestedOrder ?? 0,
        addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date().toISOString(),
      }))
  } catch {
    return []
  }
}

export function useProcurementList() {
  const [items, setItems] = useState<ProcurementItem[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      setItems(defaultProcurementItems)
      return
    }
    setItems(parseStoredItems(raw))
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const itemIds = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const addItem = useCallback((input: ProcurementInput) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === input.id)) return prev
      const nextItem: ProcurementItem = {
        ...input,
        orderQty: input.orderQty ?? input.suggestedOrder,
        addedAt: new Date().toISOString(),
      }
      return [...prev, nextItem]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateOrderQty = useCallback((id: string, qty: number) => {
    const normalized = Number.isFinite(qty) ? Math.max(0, Math.round(qty)) : 0
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, orderQty: normalized } : item)))
  }, [])

  const clearItems = useCallback(() => {
    setItems([])
  }, [])

  const isItemAdded = useCallback((id: string) => itemIds.has(id), [itemIds])

  return {
    items,
    addItem,
    removeItem,
    updateOrderQty,
    clearItems,
    isItemAdded,
  }
}
