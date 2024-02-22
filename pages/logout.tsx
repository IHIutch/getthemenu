import * as React from 'react'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { createClientComponent } from '@/utils/supabase/component'

export default function SignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const supabase = createClientComponent()

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await axios.post(`/api/auth/signout`, {
          event,
          session,
        })
        queryClient.clear()
        router.replace('/')
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [queryClient, router, supabase.auth])

  supabase.auth.signOut()

  return <></>
}
