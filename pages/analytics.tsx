import type { GetServerSidePropsContext } from 'next'

import DashboardLayout from '@/layouts/Dashboard'
import { appRouter } from '@/server'
import { createClientServer } from '@/utils/supabase/server-props'
import { Container, Flex, Text } from '@chakra-ui/react'
import { createServerSideHelpers } from '@trpc/react-query/server'
import * as React from 'react'
import SuperJSON from 'superjson'

export default function Analytics() {
  return (
    <Container maxW="container.lg" py="24">
      <Flex
        bg="white"
        align="center"
        justify="center"
        p="6"
        rounded="md"
        shadow="base"
      >
        <Text>Coming Soon</Text>
      </Flex>
    </Container>
  )
}

Analytics.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
  const { data } = await supabase.auth.getUser()

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: {
        user: data.user,
      },
    },
    transformer: SuperJSON,
  })

  const user = await helpers.user.getAuthedUser.fetch()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  else if (user.restaurants.length === 0) {
    return {
      redirect: {
        destination: '/get-started',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
      trpcState: helpers.dehydrate(),
    },
  }
}
