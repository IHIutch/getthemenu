import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  getRestaurant,
  getRestaurants,
  putRestaurant,
} from '../axios/restaurants'

export const useGetRestaurants = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['restaurants', params],
    async () => await getRestaurants(params),
    {
      enabled: !!params,
    }
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useGetRestaurant = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['restaurants', id],
    async () => await getRestaurant(id),
    {
      enabled: !!id,
    }
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateRestaurant = (params) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: mutate,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(
    async ({ id, payload }) => {
      await putRestaurant(id, payload)
    },
    {
      // When mutate is called:
      onMutate: async ({ payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['restaurants', params])
        const previous = queryClient.getQueryData(['restaurants', params])
        queryClient.setQueryData(['restaurants', params], (old) => ({
          ...old,
          ...payload,
        }))
        return { previous, payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['restaurants', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['restaurants', params])
      },
    }
  )
  return {
    mutate,
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}
