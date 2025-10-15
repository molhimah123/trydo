import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware() {
  // For now, we'll handle auth protection in the components
  // This middleware can be enhanced later with proper Supabase SSR
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/auth/:path*'],
}
