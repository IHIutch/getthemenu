import { getErrorMessage } from '@/utils/functions'
import { createClientComponent } from '@/utils/supabase/component'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import * as React from 'react'

export default function SignOut() {
  const router = useRouter()
  const supabase = createClientComponent()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error)
          throw new Error(error.message)
        queryClient.clear()
      }
      catch (error) {
        alert(getErrorMessage(error))
      }
    }

    handleLogout()

    router.replace('/login')
  }, [queryClient, router, supabase.auth])

  return <></>
}
