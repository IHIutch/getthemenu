import { Image } from '@chakra-ui/image'
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/layout'
import { Select } from '@chakra-ui/select'
import { Spinner } from '@chakra-ui/spinner'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Head from 'next/head'
import { getPublicURL } from '@/utils/functions'
import { useGetMenu, useGetMenus } from '@/utils/react-query/menus'
import { useGetMenuItems } from '@/utils/react-query/menuItems'
import { useGetSections } from '@/utils/react-query/sections'
import { useGetRestaurants } from '@/utils/react-query/restaurants'

export default function MenuView({ host }) {
  const { query, replace, push } = useRouter()
  const [activeMenu, setActiveMenu] = useState(query?.slug || null)

  const currentSlug = useMemo(() => {
    return query?.slug || null
  }, [query?.slug])

  const { data: restaurants } = useGetRestaurants({ subdomain: host })
  const { data: menus } = useGetMenus({ restaurantId: restaurants?.[0]?.id })
  const { data: menu } = useGetMenu(query?.slug)
  const { data: menuItems } = useGetMenuItems(menu?.id && { menuId: menu.id })
  const { data: sections } = useGetSections(menu?.id && { menuId: menu.id })

  useEffect(() => {
    if (!query?.slug) {
      replace(`/${menus?.[0]?.id}`)
    }
  }, [menus, query?.slug, replace])

  useEffect(() => {
    if (activeMenu !== currentSlug) {
      push(`/${activeMenu}`)
    }
  }, [activeMenu, currentSlug, push])

  return (
    <>
      <Head>
        <title>{restaurants?.[0]?.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.sm">
        <Select
          value={activeMenu}
          onChange={(e) => {
            setActiveMenu(e.target.value)
          }}
        >
          {menus?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </Select>
        <Stack>
          {/* <Box>
          <Heading as="h2" fontSize="2xl">
            Restaurant
          </Heading>
          <Text as="pre" fontSize="xs">
            {JSON.stringify(restaurant, null, 2)}
          </Text>
        </Box> */}
          <Box>
            <Heading as="h2" fontSize="3xl">
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
                                <Image
                                  h="100%"
                                  w="100%"
                                  objectFit="cover"
                                  src={
                                    item?.image?.src
                                      ? getPublicURL(item.image.src)
                                      : ''
                                  }
                                  fallback={
                                    item?.image?.blurDataURL ? (
                                      <Box>
                                        <Blurhash
                                          hash={item.image.blurDataURL}
                                          width={800}
                                          height={400}
                                          resolutionX={1600}
                                          resolutionY={900}
                                          punch={1}
                                        />
                                      </Box>
                                    ) : (
                                      <Flex align="center" justify="center">
                                        <Spinner size="sm" />
                                      </Flex>
                                    )
                                  }
                                />
                              </AspectRatio>
                              <Box p="4">
                                <Heading as="h4" fontSize="lg">
                                  {item.title}
                                </Heading>
                                <Text fontWeight="semibold">${item.price}</Text>
                                <Text>{item.description}</Text>
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
          {/* <Box>
          <Heading as="h2" fontSize="2xl">
            Sections
          </Heading>
          <Text as="pre">{JSON.stringify(sections, null, 2)}</Text>
        </Box> */}
          {/* <Box>
          <Heading as="h2" fontSize="2xl">
            Menus
          </Heading>
          <Text as="pre">{JSON.stringify(menus, null, 2)}</Text>
        </Box> */}
          {/* <Box>
          <Heading as="h2" fontSize="2xl">
            Menu Items
          </Heading>
          <Text as="pre">{JSON.stringify(menuItems, null, 2)}</Text>
        </Box> */}
        </Stack>
      </Container>
    </>
  )
}
