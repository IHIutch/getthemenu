import { trpc } from '../trpc/client'
import { RouterInputs } from '@/server'

// export const useGetRestaurants = (userId: RouterInputs['restaurant']['getAllByUserId']['where']['userId'] = '') => {
//   const { isPending, isError, isSuccess, data, error } = trpc.restaurant.getAllByMenuId.useQuery(
//     { where: { userId } },
//     { enabled: userId !== '' }
//   )
//   return {
//     data,
//     error,
//     isPending,
//     isError,
//     isSuccess,
//   }
// }

export const useGetRestaurant = (id: RouterInputs['restaurant']['getById']['where']['id'] = '') => {
  const { isLoading, isError, isSuccess, data, error } =
    trpc.restaurant.getById.useQuery(
      { where: { id } },
      { enabled: id !== '' }
    )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateRestaurant = (id: RouterInputs['restaurant']['getById']['where']['id'] = '') => {
  const { restaurant: restaurantUtils } = trpc.useUtils()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = trpc.restaurant.update.useMutation({

    // When mutate is called:
    onMutate: async ({ where: { id }, payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await restaurantUtils.getById.cancel({
        where: { id }
      })
      const previous = restaurantUtils.getById.getData({
        where: { id }
      })

      restaurantUtils.getById.setData({
        where: { id }
      }, (old) => {
        return old ? {
          ...old,
          ...payload,
          updatedAt: new Date()
        } : undefined
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _updated, context) => {
      restaurantUtils.getById.setData({ where: { id } }, context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (_updated) => {
      restaurantUtils.getById.invalidate({
        where: { id }
      })
    },
  })

  return {
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}
