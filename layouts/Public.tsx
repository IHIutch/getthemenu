import * as React from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
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
  chakra,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import dayjs from 'dayjs'
import { Phone, Clock } from 'lucide-react'
import { formatTime } from '@/utils/functions'
import BlurImage from '@/components/common/BlurImage'
import { RouterOutputs } from '@/server'
import { DAYS_OF_WEEK } from '@/utils/zod'

export default function PublicLayout({
  restaurant,
  menus,
  children
}: {
  restaurant: Pick<RouterOutputs['restaurant']['getById'], 'coverImage' | 'name' | 'phone' | 'email' | 'hours' | 'address'>,
  menus: RouterOutputs['menu']['getAllByRestaurantId'],
  children: React.ReactNode
}) {
  const modalState = useDisclosure()
  const router = useRouter()

  const slug = router.query?.slug?.toString()
  const activeMenu = slug
    ? (menus || []).find((menu) => menu.slug === slug)
    : menus?.[0]

  const [activeSlug, setActiveSlug] = React.useState(slug)

  React.useEffect(() => {
    if (activeSlug !== slug) {
      router.push(`/${activeSlug}`,)
    }
  }, [activeSlug, router, slug])

  const weekdayName = dayjs().format('dddd') as typeof DAYS_OF_WEEK[number]
  const isSiteReady = React.useMemo(() => {
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
                      fill={true}
                      priority={true}
                      sizes="100vw"
                      placeholder={restaurant?.coverImage?.blurDataURL ? "blur" : 'empty'}
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
                                {restaurant.hours?.[weekdayName]?.openTime ?
                                  formatTime(
                                    restaurant.hours?.[weekdayName]?.openTime || ''
                                  ) : null}{' '}
                                -{' '}
                                {restaurant.hours?.[weekdayName]?.closeTime ?
                                  formatTime(
                                    restaurant.hours?.[weekdayName]?.closeTime || ''
                                  ) : null}
                              </Text>
                            ) : (
                              <Text>Closed Today</Text>
                            )}
                          </Stack>
                        </Flex>
                        {isSiteReady && (
                          <Box display={{ lg: 'none' }} flexShrink="0">
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
                      <GridItem colSpan={{ base: 12, lg: 7 }}>
                        <Stack direction="row" align="flex-end">
                          <FormControl flexGrow="1" id="menu">
                            <FormLabel mb="1">Select a Menu</FormLabel>
                            <Select
                              bg="white"
                              value={activeMenu?.slug || ''}
                              onChange={(e) => {
                                setActiveSlug(e.target.value)
                              }}
                            >
                              {menus?.map((m) => (
                                <option key={m.id} value={m.slug || ''}>
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
                      colSpan={{ base: 12, lg: 7 }}
                      position="relative"
                    >
                      <LayoutGroup>
                        <AnimatePresence initial={false}>
                          <motion.main
                            key={router.asPath}
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
                      </LayoutGroup>
                    </GridItem>
                    <GridItem
                      display={{ base: 'none', lg: 'block' }}
                      colSpan={{ base: 12, lg: 4 }}
                      colStart={{ lg: 9 }}
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
                                {restaurant?.phone && restaurant.phone.length > 0 ? (
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
                                ) : null}
                                {restaurant?.address ? (
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
                                ) : null}
                                {restaurant?.email && restaurant.email.length > 0 ? (
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
                                ) : null}
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
                                {DAYS_OF_WEEK.map((day) => (
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
                                      {restaurant?.hours?.[day]?.isOpen ? (
                                        <Text as="dd">
                                          {restaurant.hours?.[day]?.openTime &&
                                            formatTime(
                                              restaurant.hours?.[day]?.openTime || ''
                                            )}{' '}
                                          -{' '}
                                          {restaurant.hours?.[day]?.closeTime &&
                                            formatTime(
                                              restaurant.hours?.[day]?.closeTime || ''
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
              <MagicLink href={{ pathname: "https://getthemenu.io", query: { ref: router.query.host?.toString() } }} color="blue.500" target="_blank">
                GetTheMenu
              </MagicLink>
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
                    {restaurant?.phone && restaurant.phone.length > 0 ? (
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
                    ) : null}

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

                    {restaurant?.email && restaurant?.email?.length > 0 ? (
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
                    ) : null}
                  </Stack>
                </TabPanel>
                <TabPanel px="0">
                  <Stack spacing="3">
                    {DAYS_OF_WEEK.map((day) => (
                      <Flex as="dl" key={day} justify="space-between" w="100%">
                        <Box>
                          <Text as="dt" fontWeight="semibold">
                            {day}:
                          </Text>
                        </Box>
                        <Box>
                          {restaurant?.hours?.[day]?.isOpen ? (
                            <Text as="dd">
                              {restaurant.hours?.[day]?.openTime &&
                                formatTime(
                                  restaurant.hours?.[day]?.openTime || ''
                                )}{' '}
                              -{' '}
                              {restaurant.hours?.[day]?.closeTime &&
                                formatTime(restaurant.hours?.[day]?.closeTime || '')}
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

// wrap the NextLink with Chakra UI's factory function
const MagicLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) => ['href', 'target', 'children'].includes(prop),
})
