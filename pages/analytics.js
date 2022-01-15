import DashboardLayout from '@/layouts/Dashboard'
import { Container, Flex } from '@chakra-ui/layout'
import React from 'react'

export default function Analytics() {
  return (
    <Container maxW="container.md">
      <Flex
        bg="white"
        align="center"
        justify="center"
        p="6"
        rounded="md"
        shadow="base"
      >
        Coming Soon
      </Flex>
    </Container>
  )
}

Analytics.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
