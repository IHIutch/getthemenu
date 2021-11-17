import React, { useEffect, useState } from 'react'
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/layout'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Image } from '@chakra-ui/image'
import { Select } from '@chakra-ui/select'
import { FormControl, FormLabel } from '@chakra-ui/form-control'

export default function PublicMenuLayout({ restaurant, menus, children }) {
  const { asPath, push, query } = useRouter()
  const slug = query?.slug?.[0] || ''
  const [activeMenu, setActiveMenu] = useState(slug)

  useEffect(() => {
    if (activeMenu !== slug) {
      push(`/${activeMenu}`, `/${activeMenu}`, {
        scroll: false,
      })
    }
  }, [activeMenu, slug, push])

  return (
    <>
      <Head>
        <title>{restaurant.title}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        /> */}
      </Head>
      <Box position="fixed" boxSize="100%" overflow="auto">
        <Box>
          <AspectRatio ratio={{ base: 16 / 9, lg: 21 / 9 }}>
            <Box boxSize="100%">
              <Image
                boxSize="100%"
                objectFit="cover"
                src="https://picsum.photos/1500/450/"
                alt={restaurant.title}
              />
              <Flex
                position="absolute"
                bottom="0"
                left="0"
                w="100%"
                py="4"
                // boxSize="100%"
                bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.9))"
                // align="end"
                color="white"
              >
                <Container maxW="container.xl">
                  <Heading as="h1" mb="1" textShadow="0 2px 1px black">
                    {restaurant.name}
                  </Heading>
                  <Flex>
                    <Box>
                      <Text as="span">
                        <Text as="span" fontWeight="semibold" mr="2">
                          Phone:
                        </Text>
                        {restaurant.phone}
                      </Text>
                    </Box>
                    <Box ml="6">
                      <Text as="span">
                        <Text as="span" fontWeight="semibold" mr="2">
                          Address:
                        </Text>
                        {restaurant.address.street} {restaurant.address.city},{' '}
                        {restaurant.address.state} {restaurant.address.zip}
                      </Text>
                    </Box>
                  </Flex>
                </Container>
              </Flex>
            </Box>
          </AspectRatio>
        </Box>
        <Box
          position="sticky"
          top="0"
          borderBottomWidth="1px"
          py="4"
          bg="gray.50"
          zIndex="1"
        >
          <Container maxW="container.xl">
            <Grid templateColumns="repeat(12, 1fr)" gap="4">
              <GridItem colSpan={{ base: '12', lg: '7' }}>
                <FormControl id="menu">
                  <FormLabel mb="1">Select a Menu</FormLabel>
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
                </FormControl>
              </GridItem>
            </Grid>
          </Container>
        </Box>
        <Container maxW="container.xl">
          <Grid templateColumns="repeat(12, 1fr)" gap="4">
            <GridItem colSpan={{ base: '12', lg: '7' }} position="relative">
              <AnimateSharedLayout type="crossfade">
                <AnimatePresence>
                  <motion.main
                    key={asPath}
                    initial={'hidden'}
                    animate={'enter'}
                    exit={'exit'}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: 0,
                        y: 50,
                        position: 'absolute',
                      },
                      enter: { opacity: 1, x: 0, y: 0, position: 'relative' },
                      exit: { opacity: 0, x: 0, y: 50, position: 'absolute' },
                    }}
                    transition={{
                      type: 'easeInOut',
                    }}
                    style={{
                      width: '100%',
                    }}
                  >
                    <Box py="4">{children}</Box>
                  </motion.main>
                </AnimatePresence>
              </AnimateSharedLayout>
            </GridItem>
            <GridItem
              d={{ base: 'none', lg: 'block' }}
              colSpan={{ base: '12', lg: '4' }}
              colStart={{ lg: '9' }}
            >
              <Box position="sticky" top="32">
                <Box mt="12" borderWidth="1px" rounded="md">
                  <Box p="4" borderBottomWidth="1px">
                    <Heading fontSize="lg">Hours</Heading>
                  </Box>
                  <VStack divider={<StackDivider />} py="2">
                    {[
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ].map((day) => (
                      <Flex
                        as="dl"
                        key={day}
                        justify="space-between"
                        px="4"
                        w="100%"
                      >
                        <Box>
                          <Text as="dt" fontSize="sm" fontWeight="semibold">
                            {day}:
                          </Text>
                        </Box>
                        <Box>
                          <Text as="dd" fontSize="sm">
                            {restaurant.hours[day].openTime} -{' '}
                            {restaurant.hours[day].closeTime}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
