import React, { useMemo } from 'react'
import Head from 'next/head'
import PublicLayout from '@/layouts/Public'
import { dehydrate, QueryClient } from 'react-query'
import { useGetMenus } from '@/utils/react-query/menus'
import { useGetSections } from '@/utils/react-query/sections'
import { useGetMenuItems } from '@/utils/react-query/menuItems'
import { useRouter } from 'next/router'
import { AspectRatio, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { prismaGetRestaurant } from '@/utils/prisma/restaurants'
import BlurImage from '@/components/common/BlurImage'
import { useSEO } from '@/utils/functions'

export default function RestaurantMenu({ restaurant, slug: initialSlug }) {
  const menusQuery = { restaurantId: restaurant.id }

  const { query } = useRouter()
  const slug = initialSlug === query?.slug?.[0] ? initialSlug : query?.slug?.[0]

  const { data: menus } = useGetMenus(menusQuery)
  const { data: sections } = useGetSections(menusQuery)
  const { data: menuItems } = useGetMenuItems(menusQuery)

  const activeMenu = slug
    ? menus.find((menu) => menu.slug === slug)
    : menus?.[0]

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
        restaurant?.customDomain ||
        `https://${restaurant.customHost}.getthemenu.io`,
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
      hasMenu: (menus || []).map((m) => ({
        '@type': 'Menu',
        name: m?.title || '',
        description: m?.description || '',
        hasMenuSection: (sections || [])
          .filter((s) => s.menuId === m.id)
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
                      (mi?.price || 0).toLocaleString('en-US', {
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

  const seo = useSEO({
    title: restaurant?.name,
    description: restaurant?.description || '',
    image: restaurant?.coverImage?.src || '',
    url:
      restaurant?.customDomain ||
      `https://${restaurant.customHost}.getthemenu.io`,
  })

  const isSiteReady = useMemo(() => {
    return activeMenu && menus?.length > 0
  }, [activeMenu, menus])

  return (
    <>
      <Head>
        {seo}
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
        {activeMenu && (
          <Stack>
            <Box>
              <Heading as="h2" fontSize="3xl" mb="4">
                {activeMenu?.title}
              </Heading>
            </Box>
            <Box>
              {sections && (
                <Stack spacing="16">
                  {sections
                    .filter((section) => section.menuId === activeMenu.id)
                    .map((section) => (
                      <Box key={section.id}>
                        <Box mb="6">
                          <Heading as="h3" fontSize="2xl" fontWeight="semibold">
                            {section.title}
                          </Heading>
                          {section.description && (
                            <Text
                              color="gray.700"
                              fontSize="lg"
                              mt="1"
                              lineHeight="1.4"
                              whiteSpace="pre-line"
                            >
                              {section.description}
                            </Text>
                          )}
                        </Box>
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
                                  {item?.image && (
                                    <AspectRatio
                                      ratio={16 / 9}
                                      mb="2"
                                      borderBottomWidth="1px"
                                    >
                                      <BlurImage
                                        alt={item?.title}
                                        src={item?.image?.src}
                                        blurDataURL={item?.image?.blurDataURL}
                                        layout="fill"
                                        objectFit="cover"
                                        placeholder="blur"
                                      />
                                    </AspectRatio>
                                  )}
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
                                      {(item?.price || item.price === 0) && (
                                        <Text
                                          color="gray.800"
                                          fontWeight="medium"
                                        >
                                          {Number(item.price).toLocaleString(
                                            'en-US',
                                            {
                                              style: 'currency',
                                              currency: 'USD',
                                            }
                                          )}
                                        </Text>
                                      )}
                                    </Flex>
                                    {item.description && (
                                      <Text
                                        color="gray.600"
                                        mt="1"
                                        whiteSpace="pre-line"
                                      >
                                        {item.description}
                                      </Text>
                                    )}
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
        )}
      </PublicLayout>
    </>
  )
}

export async function getServerSideProps({ params: { host }, query }) {
  const queryClient = new QueryClient()

  const slug = query?.slug?.[0] || null

  const restaurantQuery = { customHost: host }
  const restaurant = await prismaGetRestaurant(restaurantQuery)

  if (!restaurant) {
    return {
      notFound: true,
    }
  }
  const menus = restaurant.menus
  const activeMenu = menus.find((menu) => menu.slug === slug) || menus?.[0]

  if (menus?.length && !activeMenu) {
    return {
      notFound: true,
    }
  }

  const sections = restaurant.sections
  const menuItems = restaurant.menuItems
  delete restaurant.menus
  delete restaurant.sections
  delete restaurant.menuItems

  const menusQuery = { restaurantId: restaurant.id }

  await Promise.all([
    queryClient.prefetchQuery(['restaurants', restaurantQuery], async () =>
      restaurant
        ? {
            ...restaurant,
            createdAt: restaurant.createdAt.toISOString(),
            updatedAt: restaurant.updatedAt.toISOString(),
          }
        : null
    ),

    queryClient.prefetchQuery(['menus', menusQuery], async () =>
      menus
        ? menus.map((i) => ({
            id: i.id,
            title: i.title,
            slug: i.slug,
            position: i.position,
          }))
        : null
    ),

    queryClient.prefetchQuery(['sections', menusQuery], async () =>
      sections
        ? sections.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            position: i.position,
          }))
        : null
    ),

    queryClient.prefetchQuery(['menuItems', menusQuery], async () =>
      menuItems
        ? menuItems.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            image: i.image,
            position: i.position,
            price: i.price ? i.price.toString() : '',
          }))
        : null
    ),
  ])

  return {
    props: {
      host,
      slug,
      restaurant: {
        ...restaurant,
        createdAt: restaurant.createdAt.toISOString(),
        updatedAt: restaurant.updatedAt.toISOString(),
      },
      dehydratedState: dehydrate(queryClient),
    },
  }
}
