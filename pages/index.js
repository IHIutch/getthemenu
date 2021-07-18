import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Box, Button, Heading, Link } from '@chakra-ui/react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next Apps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Heading as="h1">GetTheMenu</Heading>

        <NextLink href="/register" passHref>
          <Button as={Link} colorScheme="blue">
            Register
          </Button>
        </NextLink>
        <NextLink href="/log-in" passHref>
          <Button as={Link}>Log In</Button>
        </NextLink>
      </Box>
    </>
  )
}
