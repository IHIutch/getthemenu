import React from 'react'
import AccountLayout from '@/layouts/Account'
import {
  Container,
  Heading,
  Stack,
  Box,
  Button,
  Text,
  GridItem,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useAuthUser } from '@/utils/react-query/user'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import initStripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

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
            <Text className="mb-6">
              {user?.stripeSubscriptionId ? (
                <Button onClick={loadCustomerPortal}>Payment Portal</Button>
              ) : (
                <Stack>
                  {prices.map((price) => (
                    <GridItem
                      key={price.id}
                      p="4"
                      rounded="md"
                      borderWidth="1px"
                    >
                      <Box mb="2">
                        <Heading as="h2" fontSize="lg">
                          {price.name}
                        </Heading>
                        <Text color="gray.600">
                          ${price.price / 100} / {price.interval}
                        </Text>
                      </Box>
                      <Box>
                        <Button
                          variant="link"
                          colorScheme="blue"
                          onClick={() => loadCheckout(price.id)}
                        >
                          Subscribe
                        </Button>
                      </Box>
                    </GridItem>
                  ))}
                </Stack>
              )}
            </Text>
          </>
        )}
      </Box>
    </>
  )
}

Account.getLayout = (page) => <AccountLayout>{page}</AccountLayout>

export const getStaticProps = async () => {
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

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  return {
    props: {
      plans: sortedPlans,
    },
  }
}
