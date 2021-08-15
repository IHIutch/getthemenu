import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { apiGetRestaurants } from '@/controllers/restaurants'
import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { apiGetMenus } from '@/controllers/menus'
import { apiGetMenuItems } from '@/controllers/menuItems'

export default function RestaurantHome({ host, restaurant, menus, menuItems }) {
  const router = useRouter()
  const { query } = router
  console.log({ host, query })

  return (
    <div>
      <Head>
        <title>{restaurant?.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading as="h1">Host: {host}</Heading>
      <Stack>
        <Box>
          <Heading as="h2" fontSize="2xl">
            Restaurant
          </Heading>
          <Text as="pre">{JSON.stringify(restaurant, null, 2)}</Text>
        </Box>
        <Box>
          <Heading as="h2" fontSize="2xl">
            Menus
          </Heading>
          <Text as="pre">{JSON.stringify(menus, null, 2)}</Text>
        </Box>
        <Box>
          <Heading as="h2" fontSize="2xl">
            Menu Items
          </Heading>
          <Text as="pre">{JSON.stringify(menuItems, null, 2)}</Text>
        </Box>
      </Stack>
    </div>
  )
}

export async function getStaticProps(context) {
  console.log('getStaticProps', context)
  const host = context.params.host.split('.')[0]

  const restaurants = await apiGetRestaurants({
    subdomain: host,
  })
  const restaurant = restaurants[0]
  const menus = await apiGetMenus({
    restaurantId: restaurant.id,
  })
  const menuItems = await apiGetMenuItems({
    restaurantId: restaurant.id,
  })

  return {
    props: {
      host,
      restaurant,
      menus,
      menuItems,
    },
    // revalidate: 10,
  }
}

export async function getStaticPaths() {
  const restaurants = await apiGetRestaurants()
  const paths = restaurants.map((restaurant) => ({
    params: {
      host: `${restaurant.subdomain}.getthemenu.io`,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}
