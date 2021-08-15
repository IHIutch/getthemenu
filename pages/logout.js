import React, { useEffect } from 'react'
import supabase from '@/utils/supabase'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'

export default function SignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await axios.post(`/api/auth/signout`, {
          event,
          session,
        })
        queryClient.invalidateQueries(['user'])
        router.replace('/')
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [queryClient, router])

  useEffect(() => {
    supabase.auth.signOut()
  }, [])

  return <></>
}
