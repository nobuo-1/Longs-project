import { prisma } from "@/src/lib/prisma"

export type CategoryDTO = {
  id: string
  name: string
  sellThroughDays: number
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const rows = await prisma.productCategory.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
  })
  return rows.map((c) => ({ id: c.id, name: c.name, sellThroughDays: c.sellThroughDays }))
}

export async function createCategory(name: string, sellThroughDays: number): Promise<CategoryDTO> {
  const c = await prisma.productCategory.create({ data: { name, sellThroughDays } })
  return { id: c.id, name: c.name, sellThroughDays: c.sellThroughDays }
}

export async function updateCategory(
  id: string,
  name: string,
  sellThroughDays: number,
): Promise<CategoryDTO> {
  const c = await prisma.productCategory.update({
    where: { id },
    data: { name, sellThroughDays },
  })
  return { id: c.id, name: c.name, sellThroughDays: c.sellThroughDays }
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
