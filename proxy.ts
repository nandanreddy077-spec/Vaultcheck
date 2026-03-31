import '@/lib/env-bootstrap'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseUrl } from '@/lib/supabase/url'

function isSupabaseAuthCookie(name: string) {
  return name.startsWith('sb-') && name.includes('auth-token')
}

function clearSupabaseAuthCookies(response: NextResponse, request: NextRequest) {
  for (const cookie of request.cookies.getAll()) {
    if (isSupabaseAuthCookie(cookie.name)) {
      response.cookies.set(cookie.name, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
      })
    }
  }
  return response
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Call getUser() — this verifies the JWT with Supabase servers and automatically
  // refreshes the access token via the refresh token when needed. getSession() only
  // reads the cookie without refreshing, causing 401s on Vercel after token expiry.
  let user: { id: string } | null = null
  let authErrorCode: string | null = null

  try {
    const { data: userData, error } = await supabase.auth.getUser()
    if (error) {
      authErrorCode = (error as { code?: string }).code || null
    } else {
      user = userData?.user ?? null
    }
  } catch {
    authErrorCode = 'session_unavailable'
  }

  const { pathname } = request.nextUrl

  if (authErrorCode === 'refresh_token_not_found') {
    if (pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login?error=session_expired', request.url)
      return clearSupabaseAuthCookies(NextResponse.redirect(loginUrl), request)
    }

    return clearSupabaseAuthCookies(supabaseResponse, request)
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const matcher = [
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
]
