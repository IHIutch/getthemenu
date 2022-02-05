import supabase from '@/utils/supabase'
import { useQuery } from 'react-query'
import { getUser } from '../axios/users'

export const useAuthUser = () => {
  const sessionUser = supabase.auth.user()
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['user'],
    async () => {
      const user = await getUser(sessionUser.id)
      return {
        id: sessionUser.id, // return this so sessionUser can be returned until getUser is resolved
        ...user,
      }
    },
    {
      enabled: !!sessionUser,
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
