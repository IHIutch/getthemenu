import * as React from 'react'
import DashboardLayout from '@/layouts/Dashboard'
import { Container, Flex, Text } from '@chakra-ui/react'

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
