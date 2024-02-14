import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteSection,
  getSection,
  getSections,
  postSection,
  putSection,
  putSectionsReorder,
} from '../axios/sections'

export const useGetSections = (params: {}) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['sections', params],
    queryFn: async () => await getSections(params)
  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useGetSection = (id: number) => {
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['sections', id],
    queryFn: async () => await getSection(id)
  })
  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
  }
}

export const useCreateSection = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (payload: {}) => await postSection(payload),
    // When mutate is called:
    onMutate: async (updated) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sections', params]
      })
      const previous = queryClient.getQueryData(['sections', params])
      queryClient.setQueryData(['sections', params], (old) => {
        return [...old, updated]
      })
      return { previous, updated }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['sections', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['sections', params]
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

export const useUpdateSection = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }: { id: number, payload: {} }) => {
      await putSection(id, payload)
    },
    // When mutate is called:
    onMutate: async ({ payload }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sections', params]
      })
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
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['sections', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['sections', params]
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

export const useReorderSections = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (payload: {}) => {
      await putSectionsReorder(payload)
    },
    // When mutate is called:
    onMutate: async (payload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sections', params]
      })
      const previous = queryClient.getQueryData(['sections', params])
      queryClient.setQueryData(['sections', params], (old) => {
        return old.map((o) => {
          return {
            ...o,
            ...(payload.find((p) => p.id === o.id) || {}),
          }
        })
      })
      return { previous, updated: payload }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['sections', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['sections', params]
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

export const useDeleteSection = (params: {}) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: async (id: number) => await deleteSection(id),
    // When mutate is called:
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['sections', params]
      })
      const previous = queryClient.getQueryData(['sections', params])
      queryClient.setQueryData(['sections', params], (old) => {
        return old.filter((o) => o.id !== id)
      })
      return { previous, updated: id }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, updated, context) => {
      queryClient.setQueryData(['sections', params], context?.previous)
    },
    // Always refetch after error or success:
    onSettled: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['sections', params]
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
