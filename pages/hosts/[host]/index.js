import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Link,
} from '@chakra-ui/react'
import MenuView from '@/components/views/MenuView'

export default function RestaurantHome({ host }) {
  return host ? (
    <MenuView host={host} />
  ) : (
    <>
      <Head>
        <title>GetTheMenu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center h="100%">
        <Box>
          <Heading as="h1">GetTheMenu</Heading>
          <ButtonGroup>
            <NextLink href="/register" passHref>
              <Button as={Link} colorScheme="blue">
                Register
              </Button>
            </NextLink>
            <NextLink href="/" passHref>
              <Button as={Link}>Log In</Button>
            </NextLink>
          </ButtonGroup>
        </Box>
      </Center>
    </>
  )
}

export async function getServerSideProps(context) {
  const host =
    context.params.host !== 'getthemenu.io' &&
    context.params.host !== 'localhost'
      ? context.params.host.split('.')[0]
      : ''
  // : 'hello'

  return {
    props: {
      host,
    },
    // revalidate: 10,
  }
}

// export async function getStaticPaths() {
//   const restaurants = await apiGetRestaurants()
//   const paths = restaurants.map((restaurant) => ({
//     params: {
//       host: `${restaurant.subdomain}.getthemenu.io`,
//     },
//   }))

//   return {
//     paths,
//     fallback: 'blocking',
//   }
// }
