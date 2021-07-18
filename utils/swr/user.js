import useSWR from 'swr'
import supabase from '@/utils/supabase'

export const useAuthUser = ({ initialData = null }) => {
  const user = supabase.auth.user()
  const { data, error } = useSWR(user ? `/api/users/${user.id}` : null, {
    initialData,
  })

  return {
    data:
      user && data
        ? {
            ...user,
            ...data,
          }
        : null,
    isLogged: user || data,
    isLoading: !error && !data,
    isError: error,
  }
}
