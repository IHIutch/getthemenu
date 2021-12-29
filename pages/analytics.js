import DashboardLayout from '@/layouts/Dashboard'
import { Container, Flex } from '@chakra-ui/layout'
import React from 'react'

export default function Analytics() {
  return (
    <>
      <DashboardLayout>
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
      </DashboardLayout>
    </>
  )
}
