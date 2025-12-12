// proxy.ts
import { NextResponse, NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export default async function proxy(request: NextRequest) {
  await updateSession(request)  // menjalankan session update
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
