import { Box } from '@chakra-ui/react'
import prisma from '~/utils/db'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Login } from '../components/Login'
import getSupabaseServerClient from '../utils/supabase/server'

export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data, error: _error } = await supabase.auth.getUser()

  if (!data.user?.id) {
    return null
  }

  const user = await prisma.users.findUnique({
    where: {
      uuid: data.user.id,
    },
    select: {
      id: true,
      fullName: true,
      restaurants: {
        select: {
          publicId: true,
        },
      },
    },
  })

  if (!user) {
    return null
  }

  return {
    ...user,
    restaurants: user?.restaurants || [],
  }
})

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { email: string, password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const user = await fetchUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    return {
      user,
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <Login />
    }

    throw error
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
