import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  getSection,
  getSections,
  postSection,
  putSection,
} from '../axios/sections'

export const useGetSections = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['sections', params],
    async () => await getSections(params)
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useGetSection = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['sections', id],
    async () => await getSection(id)
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useCreateSection = (params) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, isError, isSuccess, data, error } = useMutation(
    postSection,
    {
      // When mutate is called:
      onMutate: async (updated) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['sections', params])
        const previous = queryClient.getQueryData(['sections', params])
        queryClient.setQueryData(['sections', params], (old) => {
          return [...old, updated]
        })
        return { previous, updated }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['sections', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['sections', params])
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

export const useUpdateSections = (params) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, isError, isSuccess, data, error } = useMutation(
    async ({ id, payload }) => {
      await putSection(id, payload)
    },
    {
      // When mutate is called:
      onMutate: async ({ payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['sections', params])
        const previous = queryClient.getQueryData(['sections', params])
        queryClient.setQueryData(['sections', params], (old) => {
          return old.map((o) => {
            if (o.id === payload.id) {
              return payload
            }
            return o
          })
        })
        return { previous, payload }
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updated, context) => {
        queryClient.setQueryData(['sections', params], context.previous)
      },
      // Always refetch after error or success:
      onSettled: (updated) => {
        queryClient.invalidateQueries(['sections', params])
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
