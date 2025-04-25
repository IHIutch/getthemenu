import type { CookieOptions } from '@supabase/ssr'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient, serialize } from '@supabase/ssr'
import { env } from '../env'

export function createClientApi(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', serialize(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', serialize(name, '', options))
        },
      },
    },
  )

  return supabase
}
