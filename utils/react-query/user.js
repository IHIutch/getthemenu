import supabase from '@/utils/supabase'
import { useQuery } from 'react-query'
import { getUser } from '../axios/users'

export const useAuthUser = () => {
  const sessionUser = supabase.auth.user()
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['user'],
    async () => {
      if (sessionUser) {
        const user = await getUser(sessionUser.id)
        return {
          // ...sessionUser,
          ...user,
        }
      }
      return null
    }
  )
  return {
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  }
}
