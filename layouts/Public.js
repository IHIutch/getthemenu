import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import dayjs from 'dayjs'
import { Phone, Clock } from 'lucide-react'
import { formatTime } from '@/utils/functions'
import BlurImage from '@/components/common/BlurImage'

export default function PublicLayout({ restaurant, menus, children }) {
  const modalState = useDisclosure()
  const { asPath, push, query } = useRouter()

  const slug = query?.slug?.[0] || ''
  const activeMenu = slug
    ? menus.find((menu) => menu.slug === slug)
    : menus?.[0]

  const [activeSlug, setActiveSlug] = useState(slug)

  useEffect(() => {
    if (activeSlug !== slug) {
      if (asPath.includes('preview')) {
        push(
          `/preview/${query.host}/${activeSlug}`,
          `/preview/${query.host}/${activeSlug}`,
          {
            scroll: false,
            shallow: true,
          }
        )
      } else {
        push(`/${activeSlug}`, `/${activeSlug}`, {
          scroll: false,
          shallow: true,
        })
      }
    }
  }, [activeSlug, slug, push, asPath, query.host])

  const weekdayName = dayjs().format('dddd')
  const isSiteReady = useMemo(() => {
    return activeMenu && menus?.length > 0
  }, [activeMenu, menus])

  return (
    <>
      <Box position="fixed" boxSize="100%" overflow="auto">
        <Flex minHeight="100vh" direction="column" w="100%">
          <Box>
            <Box>
              <AspectRatio ratio={{ base: 4 / 3, sm: 21 / 9 }}>
                <Box boxSize="100%">
                  {restaurant?.coverImage?.src ? (
                    <BlurImage
                      alt={restaurant?.name || ''}
                      src={restaurant?.coverImage?.src}
                      blurDataURL={restaurant?.coverImage?.blurDataURL}
                      layout="fill"
                      objectFit="cover"
                      priority={true}
                      placeholder="blur"
                    />
                  ) : (
                    <Box boxSize="100%" bg="gray.400" />
                  )}
                  <Flex
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="100%"
                    pt="8"
                    pb="6"
                    bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.9))"
                  >
                    <Container maxW="container.lg" px={{ base: '2', lg: '4' }}>
                      <Heading
                        as="h1"
                        lineHeight="1.2"
                        textShadow="0 2px 1px black"
                        flexGrow="1"
                        color="white"
                        size={useBreakpointValue({ base: 'xl', sm: '2xl' })}
                        mb="4"
                      >
                        {restaurant?.name}
                      </Heading>
                      <Flex align="center">
                        <Flex wrap="wrap" color="white" flexGrow="1">
                          {restaurant?.phone?.length && (
                            <Stack direction="row" align="center" mr="6" py="1">
                              <Icon as={Phone} />
                              <Text>{restaurant.phone[0]}</Text>
                            </Stack>
                          )}
                          <Stack direction="row" align="center" py="1">
                            <Icon as={Clock} />
                            {restaurant?.hours?.[weekdayName]?.isOpen ? (
                              <Text>
                                {restaurant.hours?.[weekdayName]?.openTime &&
                                  formatTime(
                                    restaurant.hours?.[weekdayName]?.openTime
                                  )}{' '}
                                -{' '}
                                {restaurant.hours?.[weekdayName]?.closeTime &&
                                  formatTime(
                                    restaurant.hours?.[weekdayName]?.closeTime
                                  )}
                              </Text>
                            ) : (
                              <Text>Closed Today</Text>
                            )}
                          </Stack>
                        </Flex>
                        {isSiteReady && (
                          <Box d={{ lg: 'none' }} flexShrink="0">
                            <Button onClick={modalState.onOpen}>
                              View Details
                            </Button>
                          </Box>
                        )}
                      </Flex>
                    </Container>
                  </Flex>
                </Box>
              </AspectRatio>
            </Box>
            {isSiteReady ? (
              <>
                <Box
                  position="sticky"
                  top="0"
                  borderBottomWidth="1px"
                  py="4"
                  bg="gray.50"
                  zIndex="1"
                >
                  <Container maxW="container.lg" px={{ base: '2', lg: '4' }}>
                    <Grid templateColumns="repeat(12, 1fr)" gap="4">
                      <GridItem colSpan={{ base: '12', lg: '7' }}>
                        <Stack direction="row" align="flex-end">
                          <FormControl flexGrow="1" id="menu">
                            <FormLabel mb="1">Select a Menu</FormLabel>
                            <Select
                              bg="white"
                              value={activeMenu.slug}
                              onChange={(e) => {
                                setActiveSlug(e.target.value)
                              }}
                            >
                              {menus?.map((m) => (
                                <option key={m.id} value={m.slug}>
                                  {m.title}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </GridItem>
                    </Grid>
                  </Container>
                </Box>
                <Container maxW="container.lg">
                  <Grid templateColumns="repeat(12, 1fr)" gap="4" pb="8">
                    <GridItem
                      colSpan={{ base: '12', lg: '7' }}
                      position="relative"
                    >
                      <AnimateSharedLayout type="crossfade">
                        <AnimatePresence initial={false}>
                          <motion.main
                            key={asPath}
                            initial={'hidden'}
                            animate={'shown'}
                            exit={'hidden'}
                            variants={{
                              hidden: {
                                opacity: 0,
                                x: 0,
                                y: 50,
                                position: 'absolute',
                              },
                              shown: {
                                opacity: 1,
                                x: 0,
                                y: 0,
                                position: 'relative',
                              },
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
                      <Box position="sticky" top="28">
                        {restaurant?.hours && (
                          <Stack pt="4" spacing="8">
                            <Box
                              bg="white"
                              shadow="sm"
                              rounded="md"
                              borderWidth="1px"
                            >
                              <Box p="4" borderBottomWidth="1px">
                                <Heading fontSize="lg">Contact</Heading>
                              </Box>
                              <Stack spacing="4" p="4" fontSize="sm">
                                {restaurant?.phone?.length > 0 && (
                                  <Box>
                                    <Text fontWeight="semibold">Phone</Text>
                                    <Stack as="ul" spacing="1">
                                      {restaurant.phone.map((phone, idx) => (
                                        <Text
                                          as="li"
                                          key={idx}
                                          listStyleType="none"
                                        >
                                          {phone}
                                        </Text>
                                      ))}
                                    </Stack>
                                  </Box>
                                )}
                                {restaurant?.address && (
                                  <Box>
                                    <Text as="dt" fontWeight="semibold">
                                      Address
                                    </Text>
                                    <Text as="dd">
                                      {restaurant.address?.streetAddress} <br />
                                      {restaurant.address?.city},{' '}
                                      {restaurant.address?.state}{' '}
                                      {restaurant.address?.zip}
                                    </Text>
                                  </Box>
                                )}
                                {restaurant?.email?.length > 0 && (
                                  <Box>
                                    <Text fontWeight="semibold">Email</Text>
                                    <Stack as="ul" spacing="1">
                                      {restaurant.email.map((email, idx) => (
                                        <Text
                                          as="li"
                                          key={idx}
                                          listStyleType="none"
                                        >
                                          {email}
                                        </Text>
                                      ))}
                                    </Stack>
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                            <Box
                              bg="white"
                              shadow="sm"
                              rounded="md"
                              borderWidth="1px"
                            >
                              <Box p="4" borderBottomWidth="1px">
                                <Heading fontSize="lg">Hours</Heading>
                              </Box>
                              <Stack spacing="3" py="3" fontSize="sm">
                                {[
                                  'Sunday',
                                  'Monday',
                                  'Tuesday',
                                  'Wednesday',
                                  'Thursday',
                                  'Friday',
                                  'Saturday',
                                ].map((day) => (
                                  <Flex
                                    as="dl"
                                    key={day}
                                    justify="space-between"
                                    px="4"
                                    w="100%"
                                  >
                                    <Box>
                                      <Text as="dt" fontWeight="semibold">
                                        {day}:
                                      </Text>
                                    </Box>
                                    <Box>
                                      {restaurant.hours?.[day]?.isOpen ? (
                                        <Text as="dd">
                                          {restaurant.hours?.[day]?.openTime &&
                                            formatTime(
                                              restaurant.hours?.[day]?.openTime
                                            )}{' '}
                                          -{' '}
                                          {restaurant.hours?.[day]?.closeTime &&
                                            formatTime(
                                              restaurant.hours?.[day]?.closeTime
                                            )}
                                        </Text>
                                      ) : (
                                        <Text as="dd">Closed</Text>
                                      )}
                                    </Box>
                                  </Flex>
                                ))}
                              </Stack>
                            </Box>
                          </Stack>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </Container>
              </>
            ) : (
              <Center h="96">
                <Box textAlign="center">
                  <Text fontSize="5xl" mb="4">
                    🚧
                  </Text>
                  <Heading size="lg" fontWeight="semibold" mb="4">
                    Looks like this site is under construction.
                  </Heading>
                  <Text fontSize="lg" color="gray.600">
                    Check back soon!
                  </Text>
                </Box>
              </Center>
            )}
          </Box>
          <Box as="footer" borderTopWidth="1px" py="6" mt="auto">
            <Text textAlign="center" fontWeight="medium" color="gray.600">
              Powered by{' '}
              <NextLink href={{pathname: "https://getthemenu.io", query: {ref: query.host}}} passHref>
                <Link color="blue.500" target="_blank">
                  GetTheMenu
                </Link>
              </NextLink>
            </Text>
          </Box>
        </Flex>
      </Box>

      <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Restaurant Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted>
              <TabList>
                <Tab>Contact</Tab>
                <Tab>Hours</Tab>
              </TabList>

              <TabPanels>
                <TabPanel px="0">
                  <Stack spacing="4">
                    {restaurant?.phone?.length > 0 && (
                      <Box>
                        <Text fontWeight="semibold">Phone</Text>
                        <Stack as="ul" spacing="1">
                          {restaurant.phone.map((phone, idx) => (
                            <Text as="li" key={idx} listStyleType="none">
                              {phone}
                            </Text>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {restaurant?.address && (
                      <Box>
                        <Text as="dt" fontWeight="semibold">
                          Address
                        </Text>
                        <Text as="dd">
                          {restaurant.address?.streetAddress} <br />
                          {restaurant.address?.city},{' '}
                          {restaurant.address?.state} {restaurant.address?.zip}
                        </Text>
                      </Box>
                    )}

                    {restaurant?.email?.length > 0 && (
                      <Box>
                        <Text fontWeight="semibold">Email</Text>
                        <Stack as="ul" spacing="1">
                          {restaurant.email.map((email, idx) => (
                            <Text as="li" key={idx} listStyleType="none">
                              {email}
                            </Text>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </TabPanel>
                <TabPanel px="0">
                  <Stack spacing="3">
                    {[
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ].map((day) => (
                      <Flex as="dl" key={day} justify="space-between" w="100%">
                        <Box>
                          <Text as="dt" fontWeight="semibold">
                            {day}:
                          </Text>
                        </Box>
                        <Box>
                          {restaurant.hours?.[day]?.isOpen ? (
                            <Text as="dd">
                              {restaurant.hours?.[day]?.openTime &&
                                formatTime(
                                  restaurant.hours?.[day]?.openTime
                                )}{' '}
                              -{' '}
                              {restaurant.hours?.[day]?.closeTime &&
                                formatTime(restaurant.hours?.[day]?.closeTime)}
                            </Text>
                          ) : (
                            <Text as="dd">Closed</Text>
                          )}
                        </Box>
                      </Flex>
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
