import React, { useMemo } from 'react'
import Head from 'next/head'
import PublicLayout from '@/layouts/Public'
import { AspectRatio, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import BlurImage from '@/components/common/BlurImage'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import prisma from '@/utils/prisma'
import { MenuItemSchema, MenuSchema, RestaurantSchema, SectionSchema } from '@/utils/zod'
import { z } from 'zod'

export default function RestaurantMenu({
  restaurant,
  menus,
  sections,
  menuItems,
  activeMenu
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

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
      // description: restaurant?.description || '',
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

  // const seo = useSEO({
  //   title: restaurant?.name,
  //   // description: restaurant?.description || '',
  //   image: restaurant?.coverImage?.src || '',
  //   url:
  //     restaurant?.customDomain ||
  //     `https://${restaurant.customHost}.getthemenu.io`,
  // })

  // const isSiteReady = useMemo(() => {
  //   return activeMenu && menus?.length > 0
  // }, [activeMenu, menus])

  return (
    <>
      <Head>
        {/* {seo} */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>
      <PublicLayout
        restaurant={restaurant}
        menus={menus}
        isPreview={true}
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
                                        alt={item?.title || ''}
                                        src={item?.image?.src}
                                        blurDataURL={item?.image?.blurDataURL}
                                        fill={true}
                                        sizes="570px"
                                        placeholder={item?.image?.blurDataURL ? "blur" : 'empty'}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const host = context?.query?.host
  const slug = context?.query?.slug?.[0] || null

  if (!host) {
    return {
      notFound: true,
    }
  }

  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host.toString()
    },
    include: {
      menuItems: {
        orderBy: {
          position: 'asc'
        }
      },
      menus: {
        orderBy: {
          position: 'asc'
        }
      },
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  })


  if (!data || !data.menus) {
    return {
      notFound: true,
    }
  }

  const activeMenu = data.menus.find((menu) => menu.slug === slug) || data.menus[0]

  if (!activeMenu) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      host,
      slug,
      activeMenu,
      restaurant: RestaurantSchema.pick({
        name: true,
        hours: true,
        address: true,
        phone: true,
        email: true,
        coverImage: true,
        customHost: true,
        customDomain: true,
      }).parse({
        name: data.name,
        hours: data.hours,
        address: data.address,
        phone: data.phone,
        email: data.email,
        coverImage: data.coverImage,
        customHost: data.customHost,
        customDomain: data.customDomain,
      }),
      menus: z.array(MenuSchema).parse(data.menus),
      sections: z.array(SectionSchema).parse(data.sections),
      menuItems: z.array(MenuItemSchema).parse(data.menuItems),
      // trpcState: helpers.dehydrate(),
    },
  }
}
