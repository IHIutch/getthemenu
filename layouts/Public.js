import React, { useEffect, useState } from 'react'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Head from 'next/head'
import BlurUpImage from '@/components/common/BlurUpImage'
import {
  AspectRatio,
  Box,
  Button,
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
import { Phone, Clock } from 'react-feather'

export default function PublicLayout({ restaurant, menus, children }) {
  const modalState = useDisclosure()

  const { asPath, push, query } = useRouter()
  const slug = query?.slug?.[0] || ''
  const [activeMenu, setActiveMenu] = useState(slug)

  const weekdayName = dayjs().format('dddd')

  useEffect(() => {
    if (activeMenu !== slug) {
      push(`/${activeMenu}`, `/${activeMenu}`, {
        scroll: false,
        shallow: true,
      })
    }
  }, [activeMenu, slug, push])

  return (
    <>
      <Box position="fixed" boxSize="100%" overflow="auto">
        <Box>
          <AspectRatio ratio={{ base: 4 / 3, sm: 21 / 9 }}>
            <Box boxSize="100%">
              {restaurant?.coverImage?.src ? (
                <BlurUpImage
                  alt={restaurant?.name || ''}
                  src={restaurant?.coverImage?.src}
                  blurDataURL={restaurant?.coverImage?.blurDataURL}
                  priority={true}
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
                <Container maxW="container.lg">
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
                        {restaurant?.hours?.[weekdayName]?.openTime &&
                        restaurant?.hours?.[weekdayName]?.closeTime ? (
                          <Text>
                            {restaurant.hours[weekdayName].openTime} -{' '}
                            {restaurant.hours[weekdayName].closeTime}
                          </Text>
                        ) : (
                          <Text>Closed Today</Text>
                        )}
                      </Stack>
                    </Flex>
                    <Box d={{ lg: 'none' }} flexShrink="0">
                      <Button onClick={modalState.onOpen}>View Details</Button>
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
          <Container maxW="container.lg">
            <Grid templateColumns="repeat(12, 1fr)" gap="4">
              <GridItem colSpan={{ base: '12', lg: '7' }}>
                <Stack direction="row" align="flex-end">
                  <FormControl flexGrow="1" id="menu">
                    <FormLabel mb="1">Select a Menu</FormLabel>
                    <Select
                      bg="white"
                      value={activeMenu}
                      onChange={(e) => {
                        setActiveMenu(e.target.value)
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
              <Box position="sticky" top="28">
                {restaurant?.hours && (
                  <Stack pt="4" spacing="8">
                    <Box bg="white" shadow="sm" rounded="md" borderWidth="1px">
                      <Box p="4" borderBottomWidth="1px">
                        <Heading fontSize="lg">Contact</Heading>
                      </Box>
                      <Stack spacing="4" p="4" fontSize="sm">
                        {restaurant?.phone && (
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
                              {restaurant.address?.state}{' '}
                              {restaurant.address?.zip}
                            </Text>
                          </Box>
                        )}

                        {restaurant?.email && (
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
                    </Box>
                    <Box bg="white" shadow="sm" rounded="md" borderWidth="1px">
                      <Box p="4" borderBottomWidth="1px">
                        <Heading fontSize="lg">Hours</Heading>
                      </Box>
                      <Stack spacing="3" py="3" fontSize="sm">
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
                              <Text as="dt" fontWeight="semibold">
                                {day}:
                              </Text>
                            </Box>
                            <Box>
                              <Text as="dd">
                                {restaurant.hours[day].openTime} -{' '}
                                {restaurant.hours[day].closeTime}
                              </Text>
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
        <Box as="footer" borderTopWidth="1px" py="6">
          <Text textAlign="center" fontWeight="medium" color="gray.600">
            Powered by{' '}
            <NextLink href="https://getthemenu.io" passHref>
              <Link color="blue.500" target="_blank">
                GetTheMenu
              </Link>
            </NextLink>
          </Text>
        </Box>
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
                    {restaurant?.phone && (
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

                    {restaurant?.email && (
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
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ].map((day) => (
                      <Flex as="dl" key={day} justify="space-between" w="100%">
                        <Box>
                          <Text as="dt" fontWeight="semibold">
                            {day}:
                          </Text>
                        </Box>
                        <Box>
                          <Text as="dd">
                            {restaurant.hours[day].openTime} -{' '}
                            {restaurant.hours[day].closeTime}
                          </Text>
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
