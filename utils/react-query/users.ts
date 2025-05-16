import type { RouterOutputs } from '@/server'
import { trpc } from '../trpc'

export function useGetAuthedUser({ initialData }: { initialData?: RouterOutputs['user']['getAuthedUser'] } = {}) {
  const {
    isLoading,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  }
    = trpc.user.getAuthedUser.useQuery(undefined, {
      initialData,
      refetchOnMount: !initialData,
    })

  return {
    isLoading,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  }
}
