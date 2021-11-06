import DefaultLayout from '@/layouts/Default'
import { Container, Flex } from '@chakra-ui/layout'
import React from 'react'

export default function Analytics() {
  return (
    <>
      <DefaultLayout>
        <Container maxW="container.xl" py="8">
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
      </DefaultLayout>
    </>
  )
}
