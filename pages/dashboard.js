import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'

import { apiGetMenus } from '@/controllers/menus'
import { Box, Button, Flex, Heading, Link, Stack } from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'

import React from 'react'

export default function Profile({ menus }) {
  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Navbar />
      <Container py="8">
        <Box>
          <Flex mb="4" align="center">
            <Heading fontSize="xl">Your Menus</Heading>
            <Box ml="auto">
              <Button colorScheme="blue">Create a Menu</Button>
            </Box>
          </Flex>
          {menus && (
            <Stack borderTopWidth="1px" borderBottomWidth="1px">
              {menus.map((menu, idx) => (
                <NextLink passHref href={`/menu/${menu.id}`}>
                  <Link py="2" fontWeight="medium">
                    {menu.name}
                  </Link>
                </NextLink>
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </>
  )
}

export async function getServerSideProps() {
  const menus = await apiGetMenus()
  return {
    props: {
      // restaurant,
      menus,
    },
  }
}
