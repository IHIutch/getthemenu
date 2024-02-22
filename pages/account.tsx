import * as React from 'react'
import AccountLayout from '@/layouts/Account'
import {
  Container,
  Heading,
  Stack,
  Box,
  Button,
  Text,
  Alert,
  useRadioGroup,
  useRadio,
  VStack,
  AlertIcon,
  AlertDescription,
  Flex,
  Circle,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  UseRadioProps,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react'
import Head from 'next/head'
import Stripe from 'stripe'
import dayjs from 'dayjs'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { env } from '@/utils/env'
import { createClientServer } from '@/utils/supabase/server-props'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { RouterOutputs, appRouter } from '@/server'
import SuperJSON from 'superjson'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getErrorMessage } from '@/utils/functions'
import { SubmitHandler, useForm } from 'react-hook-form'

type PriceType = {
  id: Stripe.Price['id']
  name: Stripe.Product['name']
  price: Stripe.Price['unit_amount']
  interval: Stripe.Price.Recurring.Interval | undefined
  currency: Stripe.Price['currency']
  label: Stripe.Price['metadata']['label']
}

export default function Account({ plans: prices, user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: restaurant } = useGetRestaurant(user?.restaurants[0]?.id)

  return (
    <>
      <Head>
        <title>Account Details</title>
      </Head>

      <Container maxW="container.md">
        <Stack spacing="6">
          <Box bg="white" rounded="md" shadow="base">
            <UserDetails user={user} />
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <SiteDetails>
              {restaurant ? <CustomHostForm restaurant={restaurant} /> : null}
              {restaurant ? <CustomDomainForm restaurant={restaurant} /> : null}
            </SiteDetails>
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <Subscription prices={prices} user={user} />
          </Box>
        </Stack>
      </Container>
    </>
  )
}

const UserDetails = ({ user }: { user: RouterOutputs['user']['getAuthedUser'] }) => {
  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          User Details
        </Heading>
      </Box>
      <Box p="6">Email: {user?.email}</Box>
    </>
  )
}

const SiteDetails = ({ children }: { children?: React.ReactNode }) => {

  const handleCheckDomain = async (domain) => {
    try {
      // const { data: checkData } = await axios
      //   .post('/api/account/domain/check', {
      //     domain,
      //   })
      //   .catch((res) => {
      //     throw new Error(res.data.error)
      //   })
      // const { data: verifyData } = await axios
      //   .post('/api/account/domain/verify', {
      //     domain,
      //   })
      //   .catch((res) => {
      //     throw new Error(res.data.error)
      //   })

      // console.log({ checkData, verifyData })

      // const { data: createData } = await axios
      //   .post('/api/account/domain', {
      //     domain,
      //   })
      //   .catch((res) => {
      //     throw new Error(res.data.error)
      //   })

      // const { data: configData } = await axios
      //   .post('/api/account/domain/config', {
      //     domain,
      //   })
      //   .catch((res) => {
      //     throw new Error(res.data.error)
      //   })

      // console.log({ configData })
    } catch (error) {
      console.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Site Details
        </Heading>
      </Box>
      <Box p="6">
        <Stack spacing="6">
          {children}
        </Stack>
      </Box>
    </>
  )
}

const CustomHostForm = ({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const defaultValues = {
    customHost: restaurant?.customHost || ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof defaultValues>({ defaultValues })

  const onSubmit: SubmitHandler<typeof defaultValues> = (form) => {
    console.log({ form })
  }

  return (
    <Box>
      <Box>
        <Text fontWeight="semibold" mb="1">Custom Host</Text>
        <Box position="relative">
          <Box bg="gray.100" rounded="md" borderWidth="1px" borderColor="gray.300" display="flex" alignItems="center" px="3" h="10">
            <Text>{restaurant.customHost}</Text>
          </Box>
          <Box position="absolute" right="0" insetY="0" display="flex" alignItems="center">
            <Button onClick={onOpen} colorScheme="blue" size="sm" mr="1">
              Edit
            </Button>
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Edit Custom Host</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl
                isInvalid={!!errors.customHost}
              >
                <FormLabel>Custom Host</FormLabel>
                <InputGroup>
                  <Input {...register('customHost')} type="text" />
                </InputGroup>
                <FormErrorMessage>{errors.customHost?.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup>
                <Button variant='ghost' onClick={onClose}>Cancel</Button>
                <Button colorScheme='blue' type="submit">
                  Save
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

const CustomDomainForm = ({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const defaultValues = {
    customDomain: restaurant?.customDomain || ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof defaultValues>({ defaultValues })

  const onSubmit: SubmitHandler<typeof defaultValues> = (form) => {
    console.log({ form })
  }

  return (
    <Box>
      <Box>
        <Text fontWeight="semibold" mb="1">Custom Host</Text>
        <Box position="relative">
          <Box bg="gray.100" rounded="md" borderWidth="1px" borderColor="gray.300" display="flex" alignItems="center" px="3" h="10">
            <Text>{restaurant.customDomain}</Text>
          </Box>
          <Box position="absolute" right="0" insetY="0" display="flex" alignItems="center">
            <Button onClick={onOpen} colorScheme="blue" size="sm" mr="1">
              Edit
            </Button>
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Edit Custom Domain</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl
                isInvalid={!!errors.customDomain}
              >
                <FormLabel>Custom Domain</FormLabel>
                <InputGroup>
                  <Input {...register('customDomain')} type="text" />
                </InputGroup>
                <FormErrorMessage>{errors.customDomain?.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup>
                <Button variant='ghost' onClick={onClose}>Cancel</Button>
                <Button colorScheme='blue' type="submit">
                  Save
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

const Subscription = ({ prices, user }: { prices?: PriceType[], user: RouterOutputs['user']['getAuthedUser'] }) => {

  const router = useRouter()

  const loadCustomerPortal = async () => {
    const { data } = await axios.get('/api/account/stripe')
    router.push(data.url)
  }

  const loadCheckout = async (priceId: Stripe.Price['id']) => {
    const { data } = await axios.get(
      `/api/account/stripe/subscriptions/${priceId}`
    )
    const stripe = await loadStripe(
      env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    )
    await stripe?.redirectToCheckout({ sessionId: data.id })
  }

  const trialCountdown = () => {
    if (!user?.trialEndsAt) return null
    const numDays = dayjs(user.trialEndsAt).diff(dayjs(), 'day')
    return numDays === 0
      ? 'today'
      : numDays > 0
        ? `in ${numDays} day${numDays === 1 ? '' : 's'}`
        : null
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'priceId',
    defaultValue: prices?.[0]?.id || '',
  })
  const group = getRootProps()

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Subscription
        </Heading>
      </Box>
      {trialCountdown() ? (
        <Alert mb="3" status="warning">
          <AlertIcon />
          <AlertDescription>
            Your trial ends {trialCountdown()}
          </AlertDescription>
        </Alert>
      ) : null}
      <Box p="6">
        {user?.stripeSubscriptionId ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // console.log(e.target.priceId.value)
              loadCheckout(e.target.priceId.value)
            }}
          >
            <VStack {...group} spacing="-1px" mb="3">
              {(prices || []).map((price) => {
                const radio = getRadioProps({ value: price.id })
                return (
                  <CompoundRadio {...radio} key={price.id}>
                    <Text fontWeight="semibold" fontSize="lg">
                      {price.label || price.name}
                    </Text>
                    {price.price ? <Text color="gray.600">
                      ${price.price / 100} / {price.interval}
                    </Text> : null}
                  </CompoundRadio>
                )
              })}
            </VStack>
            <Flex>
              <Button
                ml="auto"
                // isLoading={isSubmitting}
                colorScheme="blue"
                type="submit"
              >
                Checkout With Stripe
              </Button>
            </Flex>
          </form>
        ) : (
          <Button onClick={loadCustomerPortal}>Payment Portal</Button>
        )}
      </Box>
    </>
  )
}

Account.getLayout = (page: React.ReactNode) => <AccountLayout>{page}</AccountLayout>

const CompoundRadio = ({ children, ...props }: { children: React.ReactNode } & UseRadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const radio = getRadioProps()

  return (
    <Box
      {...radio}
      as="label"
      width="full"
      cursor="pointer"
      _focus={{
        boxShadow: 'outline',
      }}
      transition="all 0.2s ease-in-out"
      p="4"
      borderWidth="1px"
      mt="-1px"
      _first={{
        borderTopRadius: 'md',
      }}
      _last={{
        borderBottomRadius: 'md',
      }}
      _checked={{
        zIndex: '1',
        bg: 'blue.100',
        borderColor: 'blue.500',
      }}
    >
      <input {...input} />
      <Box>
        <Flex mb="1">
          <Flex alignItems="">
            <Circle
              as={Center}
              transition="all 0.2s ease-in-out"
              mt="1.5"
              boxSize="4"
              borderWidth="2px"
              borderColor={props.isChecked ? 'blue.500' : 'gray.200'}
              bg={props.isChecked ? 'blue.500' : 'gray.100'}
              _hover={
                props.isChecked ? {
                  borderColor: 'blue.600',
                  bg: 'blue.600',
                } : {
                  borderColor: 'gray.200',
                  bg: 'gray.100',
                }
              }
            >
              <Circle
                transition="all 0.2s ease-in-out"
                size={props.isChecked ? '50%' : '0'}
                bg={props.isChecked ? 'white' : 'transparent'}
              />
            </Circle>
          </Flex>
          <Box ml="2">{children}</Box>
        </Flex>
      </Box>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      supabase
    },
    transformer: SuperJSON,
  });

  const user = await helpers.user.getAuthedUser.fetch()

  if (user.restaurants.length === 0) {
    return {
      redirect: {
        destination: '/get-started',
        permanent: false,
      },
    }
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY)

  const { data: prices } = await stripe.prices.list({
    product: 'prod_L1xgrNYxXTRyCH',
  })

  const plans: PriceType[] = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product.toString())
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring?.interval,
        currency: price.currency,
        label: price.metadata?.label || '',
      }
    })
  )

  const sortedPlans = plans.sort((a, b) => (a.price || 0) - (b.price || 0))

  return {
    props: {
      user,
      plans: sortedPlans,
      trpcState: helpers.dehydrate(),
    },
  }
}
