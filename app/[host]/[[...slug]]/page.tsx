import type { Metadata } from 'next'

import { env } from '@/utils/env'
import { getRestaurantDisplayData, getStructuredData } from '@/utils/functions'
import { MenuSchema } from '@/utils/zod'
import { AspectRatio, Box, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import NextImage from 'next/image'
import { notFound } from 'next/navigation'

export default async function MenuPage(
  props: {
    params: Promise<{ host: string, slug: string | string[] | undefined }>
  },
) {
  const params = await props.params

  const host = decodeURIComponent(params.host)
  const slug = decodeURIComponent(params.slug?.toString() || '')

  const data = await getRestaurantDisplayData(host)

  if (!data) {
    notFound()
  }

  const activeMenu = slug ? data.menus.find(m => m.slug === slug) : data.menus.shift()

  if (!activeMenu) {
    notFound()
  }

  const menu = activeMenu
  const sections = data.sections.filter(s => s.menuId === menu?.id)
  const menuItems = data.menuItems.filter(mi => mi.menuId === menu?.id)

  const ldJson = getStructuredData(data)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        suppressHydrationWarning
      />
      <Stack>
        <Box>
          <Heading as="h2" fontSize="3xl" mb="4">
            {menu?.title}
          </Heading>
        </Box>
        <Box>
          {sections && (
            <Stack gap="16">
              {sections
                .filter(section => section.menuId === menu.id)
                .map(section => (
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
                      <Stack gap="4">
                        {menuItems
                          .filter(item => item.sectionId === section.id)
                          .map(item => (
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
                                  <Image asChild>
                                    <NextImage
                                      alt={item?.title || ''}
                                      src={item?.image?.src}
                                      blurDataURL={item?.image?.blurDataURL}
                                      fill={true}
                                      sizes="570px"
                                      placeholder={item?.image?.blurDataURL ? 'blur' : 'empty'}
                                    />
                                  </Image>
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
                                        },
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
    </>
  )
}

export async function generateMetadata(
  props: { params: Promise<{ host: string, slug: string | string[] | undefined }> },
): Promise<Metadata | null> {
  const params = await props.params
  const host = decodeURIComponent(params.host)
  const slug = decodeURIComponent(params.slug?.toString() || '')

  const data = await getRestaurantDisplayData(host)
  if (!data) {
    return null
  }

  const { name: title, coverImage: image } = data
  const menu = MenuSchema.pick({
    slug: true,
  }).parse(slug ? data.menus.find(m => m.slug === slug) : data.menus.shift())

  return {
    metadataBase: new URL(`https://${host}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`),
    title,
    openGraph: {
      title: title || '',
      images: [image?.src || ''],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || '',
      images: [image?.src || ''],
    },
    alternates: {
      canonical: `https://${host}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/${menu.slug}`,
    },
  }
}
