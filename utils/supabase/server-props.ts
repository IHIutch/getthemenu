import { createServerClient, type CookieOptions, serialize } from '@supabase/ssr'
import { type GetServerSidePropsContext } from 'next'
import { env } from '../env'

export function createClientServer(context: GetServerSidePropsContext) {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.setHeader('Set-Cookie', serialize(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          context.res.setHeader('Set-Cookie', serialize(name, '', options))
        },
      },
    }
  )

  return supabase
}