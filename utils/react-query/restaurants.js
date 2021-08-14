import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  getRestaurant,
  getRestaurants,
  putRestaurant,
} from '../axios/restaurants'

export const useGetRestaurants = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['restaurants', params],
    async () => await getRestaurants(params)
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
    async () => await getRestaurant(id)
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient()
  const { isLoading, isError, isSuccess, data, error } = useMutation(
    putRestaurant,
    {
      // When mutate is called:
      onMutate: async (updated) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['restaurants', updated.id])
        const previous = queryClient.getQueryData(['restaurants', updated.id])
        queryClient.setQueryData(['restaurants', updated.id], (old) => [
          ...old,
          updated,
        ])
        return { previous, updated }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(
          ['restaurants', context.previous.id],
          context.previous
        )
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['restaurants', updated.id])
      },
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
