import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  getSection,
  getSections,
  postSection,
  putSection,
  putSectionsReorder,
} from '../axios/sections'

export const useGetSections = (params) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['sections', params],
    async () => await getSections(params),
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

export const useGetSection = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['sections', id],
    async () => await getSection(id),
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

export const useCreateSection = (params) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: mutate,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(postSection, {
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
  })
  return {
    mutate,
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useUpdateSection = (params) => {
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
              return {
                ...o,
                ...payload,
              }
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

export const useReorderSections = (params) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: mutate,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation(
    async (payload) => {
      await putSectionsReorder(payload)
    },
    {
      // When mutate is called:
      onMutate: async (payload) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['sections', params])
        const previous = queryClient.getQueryData(['sections', params])
        queryClient.setQueryData(['sections', params], (old) => {
          return old.map((o) => {
            return payload.find((p) => p.id === o.id) || o
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
