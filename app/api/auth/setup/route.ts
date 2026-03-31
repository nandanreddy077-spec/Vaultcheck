import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProvisionedUser } from '@/lib/provision-user'

export async function POST(req: NextRequest) {
  let user = null
  try {
    const supabase = await createClient()
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (bearerToken) {
      const { data: tokenUserData, error: tokenError } = await supabase.auth.getUser(bearerToken)
      if (!tokenError && tokenUserData?.user) {
        user = tokenUserData.user
      }
    }

    if (!user) {
      const { data: userData, error } = await supabase.auth.getUser()
      if (!error && userData?.user) {
        user = userData.user
      } else {
        const { data: sessionData } = await supabase.auth.getSession()
        user = sessionData?.session?.user ?? null
      }
    }
  } catch {
    user = null
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const provisionedUser = await ensureProvisionedUser({
    ...user,
    user_metadata: {
      ...(user.user_metadata || {}),
      ...(typeof body?.name === 'string' ? { name: body.name } : {}),
      ...(typeof body?.firmName === 'string' ? { firmName: body.firmName } : {}),
    },
  })

  return NextResponse.json({ ok: true, firmId: provisionedUser.firmId })
}
