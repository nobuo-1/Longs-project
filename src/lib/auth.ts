// TODO: Phase 1 で実装
// - getSession(): Cookie → Session → User
// - createSession(userId): Session 作成 + Cookie セット
// - deleteSession(): Session 削除 + Cookie 削除

export async function getSession(): Promise<{
  userId: string
  email: string
  name: string
  role: string
} | null> {
  return null
}
