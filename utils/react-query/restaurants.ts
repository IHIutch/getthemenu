import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getRestaurant,
  getRestaurants,
  putRestaurant,
} from '../axios/restaurants'
import { trpc } from '../trpc/client'

export const useGetRestaurants = (params: {}) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['restaurants', params],
    queryFn: async () => await getRestaurants(params),
    enabled: !!params
  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useGetRestaurant = (id: string | undefined) => {
  const { isLoading, isError, isSuccess, data, error } =
    trpc.restaurant.getById.useQuery({
      where: { id },
    },
      { enabled: !!id })
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateRestaurant = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: {} }) => {
      await putRestaurant(id, payload)
    },
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['restaurants', params]
      })
      const previous = queryClient.getQueryData(['restaurants', params])
      queryClient.setQueryData(['restaurants', params], (old) => ({
        ...old,
        ...payload,
      }))
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['restaurants', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['restaurants', params]
      })
    },
  }
  )
  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}
