import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(_request: NextRequest) {
  // TODO: Phase 1 で Session Cookie 検証を実装
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!login|_next|favicon.ico|.*\\..*).*)"],
}
