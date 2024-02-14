import { createClient as createClientPrimitive } from '@supabase/supabase-js'
import { env } from '../env'

export function createClientStatic() {
  const supabase = createClientPrimitive(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  return supabase
}