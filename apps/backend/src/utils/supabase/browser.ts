import { createBrowserClient } from '@supabase/ssr'
import { Route } from '~/routes/__root'

export function getSupabaseBrowserClient() {
  const { ENV: {
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY
  } } = Route.useLoaderData()
  
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY
  )
}