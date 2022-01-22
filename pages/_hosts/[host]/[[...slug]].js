import React, { useMemo } from 'react'
import { apiGetMenuItems } from '@/controllers/menuItems'
import { apiGetMenu, apiGetMenus } from '@/controllers/menus'
import { apiGetRestaurants } from '@/controllers/restaurants'
import { apiGetSections } from '@/controllers/sections'
import Head from 'next/head'
import PublicLayout from '@/layouts/Public'
import BlurUpImage from '@/components/common/BlurUpImage'
import { dehydrate, QueryClient } from 'react-query'
import { useGetMenu, useGetMenus } from '@/utils/react-query/menus'
import { useGetSections } from '@/utils/react-query/sections'
import { useGetMenuItems } from '@/utils/react-query/menuItems'
import { useRouter } from 'next/router'
import { AspectRatio, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import SEO from '@/components/global/SEO'

export default function RestaurantMenu({ restaurant, slug: initialSlug }) {
  const { query } = useRouter()
  const slug = initialSlug === query?.slug?.[0] ? initialSlug : query?.slug?.[0]
  const { data: menus } = useGetMenus({ restaurantId: restaurant.id })

  const activeMenu = slug
    ? menus.find((menu) => menu.slug === slug)
    : menus?.[0]
  const { data: menu } = useGetMenu(activeMenu?.id || null)
  const { data: sections } = useGetSections(
    activeMenu?.id ? { menuId: activeMenu.id } : null
  )
  const { data: menuItems } = useGetMenuItems(
    activeMenu?.id ? { menuId: activeMenu.id } : null
  )

  const structuredData = useMemo(() => {
    const minPrice = Math.min(
      ...(menuItems || []).map((mi) => mi?.price || 0)
    ).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    const maxPrice = Math.max(
      ...(menuItems || []).map((mi) => mi?.price || 0)
    ).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    const restaurantJson = {
      '@type': 'Restaurant',
      url:
        restaurant?.customDomain || restaurant?.customHost
          ? `https://${restaurant.customHost}.getthemenu.io`
          : '',
      name: restaurant?.name || '',
      image: restaurant?.coverImage?.src || '',
      telephone: restaurant?.phone?.[0] || '',
      priceRange: `${minPrice} - ${maxPrice}`,
      description: restaurant?.description || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: restaurant.address?.streetAddress || '',
        addressLocality: restaurant.address?.city || '',
        addressRegion: restaurant.address?.state || '',
        postalCode: restaurant.address?.zip || '',
      },
      servesCuisine: ['American cuisine'],
    }
    const menusJson = {
      hasMenu: (menus || []).map((menu) => ({
        '@type': 'Menu',
        name: menu?.title || '',
        description: menu?.description || '',
        hasMenuSection: (sections || [])
          .filter((s) => s.menuId === menu.id)
          .map((s) => ({
            '@type': 'MenuSection',
            name: s?.title,
            description: s?.description || '',
            hasMenuItem: (menuItems || [])
              .filter((mi) => mi.sectionId === s.id)
              .map((mi) => ({
                '@type': 'MenuItem',
                name: mi?.title || '',
                description: mi?.description || '',
                image: mi?.image?.src || '',
                offers: [
                  {
                    '@type': 'Offer',
                    price:
                      mi?.price?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }) || '',
                    priceCurrency: 'USD',
                  },
                ],
                // suitableForDiet: ['http://schema.org/GlutenFreeDiet'],
              })),
          })),
      })),
    }

    return {
      '@context': 'http://schema.org',
      ...restaurantJson,
      ...menusJson,
    }
  }, [restaurant, menus, sections, menuItems])

  const isSiteReady = useMemo(() => {
    return activeMenu && menus?.length > 0
  }, [activeMenu, menus])

  return (
    <>
      <Head>
        <SEO
          title={restaurant?.name}
          description={restaurant?.description || ''}
          image={restaurant?.coverImage?.src || ''}
          url={
            restaurant?.customDomain || restaurant?.customHost
              ? `https://${restaurant.customHost}.getthemenu.io`
              : ''
          }
        />
        {isSiteReady && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}
      </Head>
      <PublicLayout
        restaurant={restaurant}
        menus={menus}
        initialSlug={initialSlug}
      >
        <Stack>
          <Box>
            <Heading as="h2" fontSize="3xl" mb="4">
              {menu?.title}
            </Heading>
          </Box>
          <Box>
            {sections && (
              <Stack spacing="16">
                {sections.map((section) => (
                  <Box key={section.id}>
                    <Heading as="h3" fontSize="2xl" mb="4">
                      {section.title}
                    </Heading>
                    {menuItems && (
                      <Stack spacing="4">
                        {menuItems
                          .filter((item) => item.sectionId === section.id)
                          .map((item) => (
                            <Box
                              key={item.id}
                              borderWidth="1px"
                              rounded="md"
                              overflow="hidden"
                              bg="white"
                              shadow="sm"
                            >
                              <AspectRatio
                                ratio={16 / 9}
                                mb="2"
                                borderBottomWidth="1px"
                              >
                                <BlurUpImage
                                  alt={item?.title || 'Menu item'}
                                  src={item?.image?.src}
                                  blurDataURL={item?.image?.blurDataURL}
                                />
                              </AspectRatio>
                              <Box p="4">
                                <Flex>
                                  <Heading
                                    as="h4"
                                    fontSize="lg"
                                    flexGrow="1"
                                    fontWeight="semibold"
                                  >
                                    {item.title}
                                  </Heading>
                                  <Text color="gray.800" fontWeight="semibold">
                                    {item?.price?.toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                    })}
                                  </Text>
                                </Flex>
                                <Text color="gray.600">{item.description}</Text>
                              </Box>
                            </Box>
                          ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </PublicLayout>
    </>
  )
}

export async function getServerSideProps({ params: { host }, query }) {
  const queryClient = new QueryClient()

  const slug = query?.slug?.[0] || null

  const restaurantQuery = { customHost: host }
  const restaurants = await apiGetRestaurants(restaurantQuery)

  if (!restaurants[0]) {
    return {
      notFound: true,
    }
  }

  const menusQuery = { restaurantId: restaurants[0].id }
  const menus = await apiGetMenus(menusQuery)

  const activeMenu = slug ? menus.find((menu) => menu.slug === slug) : menus[0]

  const menu = activeMenu?.id ? await apiGetMenu(activeMenu.id) : null
  const sections = activeMenu?.id
    ? await apiGetSections({ menuId: activeMenu.id })
    : null
  const menuItems = activeMenu?.id
    ? await apiGetMenuItems({ menuId: activeMenu.id })
    : null

  await queryClient.prefetchQuery(
    ['restaurants', restaurantQuery],
    async () => restaurants
  )

  await queryClient.prefetchQuery(
    ['menus', menusQuery],
    async () => menus || null
  )

  await queryClient.prefetchQuery(
    ['menus', activeMenu?.id || null],
    async () => menu || null
  )

  await queryClient.prefetchQuery(
    ['sections', { menuId: activeMenu?.id || null }],
    async () => sections || null
  )
  await queryClient.prefetchQuery(
    ['menuItems', { menuId: activeMenu?.id || null }],
    async () => menuItems || null
  )

  return {
    props: {
      host,
      slug,
      restaurant: restaurants[0],
      dehydratedState: dehydrate(queryClient),
    },
  }
}
