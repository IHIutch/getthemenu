import { Box, Flex, Heading, Link, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link';
import React from 'react'

export default function MenuNotFound({
  params,
}: {
  params: { host: string; };
}) {

  console.log({ params })

  return (
    <VStack w="full">
      <Box textAlign="center">
        <Heading as="h1" fontSize="3xl" mb="2">We couldn&apos;t find that menu :(</Heading>
        <Text>It may have been removed or renamed.</Text>
      </Box>
      <Box>
        <Text textAlign="center">Let&apos;s take you back to the <Link as={NextLink} href='/' color="blue.500" textDecoration="underline">right place</Link>.</Text>
      </Box>
    </VStack>
  )
}
