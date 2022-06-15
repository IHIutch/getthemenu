import React, { useMemo } from 'react'
import AccountLayout from '@/layouts/Account'
import {
  Container,
  Heading,
  Stack,
  Box,
  Button,
  Text,
  GridItem,
  Alert,
  useRadioGroup,
  HStack,
  useRadio,
  VStack,
  AlertIcon,
  AlertDescription,
  Flex,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useAuthUser } from '@/utils/react-query/user'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import initStripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
import dayjs from 'dayjs'

export default function Account({ plans: prices }) {
  return (
    <>
      <Head>
        <title>Account Details</title>
      </Head>

      <Container maxW="container.md">
        <Stack spacing="6">
          <Box bg="white" rounded="md" shadow="base">
            <UserDetails />
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <Subscription prices={prices} />
          </Box>
        </Stack>
      </Container>
    </>
  )
}

const UserDetails = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()
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

const Subscription = ({ prices }) => {
  const {
    data: user,
    isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()
  const router = useRouter()

  const loadCustomerPortal = async () => {
    const { data } = await axios.get('/api/account/stripe')
    router.push(data.url)
  }

  const loadCheckout = async (priceId) => {
    const { data } = await axios.get(
      `/api/account/stripe/subscriptions/${priceId}`
    )
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    )
    await stripe.redirectToCheckout({ sessionId: data.id })
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
    defaultValue: prices[0].id,
  })
  const group = getRootProps()

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Subscription
        </Heading>
      </Box>
      <Box p="6">
        {!isUserLoading && (
          <>
            {trialCountdown ? (
              <Alert mb="3" status="warning">
                <AlertIcon />
                <AlertDescription>
                  Your trial ends {trialCountdown()}
                </AlertDescription>
              </Alert>
            ) : null}
            <Text className="mb-6">
              {!user?.stripeSubscriptionId ? (
                <Button onClick={loadCustomerPortal}>Payment Portal</Button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    loadCheckout(e.target.priceId.value)
                  }}
                >
                  <VStack {...group} spacing="0" mb="2">
                    {prices.map((price) => {
                      const radio = getRadioProps({ value: price.id })
                      return (
                        <RadioCard key={price.id} {...radio}>
                          <Heading as="h2" fontSize="lg">
                            {price.name}
                          </Heading>
                          <Text color="gray.600">
                            ${price.price / 100} / {price.interval}
                          </Text>
                        </RadioCard>
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
              )}
            </Text>
          </>
        )}
      </Box>
    </>
  )
}

Account.getLayout = (page) => <AccountLayout>{page}</AccountLayout>

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box
      as="label"
      width="full"
      borderTopWidth="1px"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      _first={{
        borderTopRadius: 'md',
      }}
      _last={{
        borderBottomRadius: 'md',
        borderBottomWidth: '1px',
      }}
      overflow="hidden"
    >
      <input {...input} />
      <Box
        {...checkbox}
        width="full"
        cursor="pointer"
        _checked={{
          bg: 'blue.100',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export const getServerSideProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

  const { data: prices } = await stripe.prices.list({
    product: 'prod_L1xgrNYxXTRyCH',
  })

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product)
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      }
    })
  )

  const subscription = await stripe.subscriptions.retrieve(
    'sub_1LAabzA1eyXMj3XCLJOcF3Zm'
  )

  console.log({ subscription })

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  return {
    props: {
      plans: sortedPlans,
    },
  }
}
