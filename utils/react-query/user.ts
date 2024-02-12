import { useQuery } from 'react-query'
import { getUser } from '../axios/users'
import { useUser } from '@supabase/auth-helpers-react'

export const useAuthUser = () => {
  const sessionUser = useUser()
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['user'],
    async () => {
      const user = await getUser(sessionUser?.id)
      return {
        id: sessionUser?.id, // return this so sessionUser can be returned until getUser is resolved
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
