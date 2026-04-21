import { type NextRequest } from 'next/server'
import { proxy, matcher } from '@/proxy'

export async function middleware(request: NextRequest) {
  return proxy(request)
}

export const config = {
  matcher: matcher,
}
