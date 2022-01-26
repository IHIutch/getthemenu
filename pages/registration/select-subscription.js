import React, { useEffect, useState } from 'react'
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import initStripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { useAuthUser } from '@/utils/react-query/user'
import axios from 'redaxios'
import supabase from '@/utils/supabase'
import { createStripeSubscription } from '@/controllers/stripe'
import { apiGetUser } from '@/controllers/users'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function SelectSubscription({ clientSecret: cs, prices }) {
  const [clientSecret, setClientSecret] = useState(cs)

  const methods = useForm({
    defaultValues: {
      price: prices[0].id,
    },
  })

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const watchPriceId = methods.watch('price')
  useEffect(() => {
    if (user) {
      const handleCreateSubscription = async () => {
        const { data } = await axios.post('/api/stripe/create-subscription', {
          user,
          priceId: watchPriceId,
        })

        setClientSecret(data.clientSecret)
      }
      handleCreateSubscription()
    }
  }, [user, watchPriceId])

  return (
    <Box>
      <Container maxW="container.sm" py="24">
        <Box bg="white" borderWidth="1px" rounded="md" p="8">
          <Box mb="8">
            <Heading as="h1" fontSize="3xl" mb="2">
              Select Subscription
            </Heading>
          </Box>
          <FormProvider {...methods}>
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm prices={prices} />
              </Elements>
            )}
          </FormProvider>
        </Box>
      </Container>
    </Box>
  )
}

const PaymentForm = ({ prices }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext()

  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      return
    }
    setIsSubmitting(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:3000',
      },
    })
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message)
    } else {
      setErrorMessage('An unexpected error occured.')
    }

    setIsSubmitting(false)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <Box>
            <FormControl as="fieldset" id="price" isInvalid={errors.price}>
              <FormLabel as="legend">Select a Subscription Level</FormLabel>
              <Controller
                name="price"
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <Stack>
                      {prices.map((price, idx) => (
                        <Radio key={idx} value={price.id}>
                          ${price.unit_amount / 100} /{' '}
                          {price?.recurring?.interval}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}
              />
              <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box>
            <AspectRatio ratio={{ base: 4 / 3, md: 16 / 9 }}>
              <Box>
                <Box d={isLoaded ? 'block' : 'none'} boxSize="100%" p="1">
                  <FormControl isInvalid={errorMessage}>
                    <PaymentElement onReady={() => setIsLoaded(true)} />
                    <FormErrorMessage>{errorMessage}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Center d={isLoaded ? 'none' : 'flex'} boxSize="100%">
                  <Spinner />
                </Center>
              </Box>
            </AspectRatio>
          </Box>
          <Box textAlign="center">
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="blue"
              isDisabled={!stripe || !elements}
            >
              Submit & Continue
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}

export const getServerSideProps = async ({ req }) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)
  const { data: prices } = await stripe.prices.list()

  const { user: sessionUser, error } = await supabase.auth.api.getUserByCookie(
    req
  )

  if (error) {
    console.error(error)
  }

  const user = await apiGetUser(sessionUser.id)

  const stripeSubscription = await createStripeSubscription({
    customerId: user.stripeCustomerId,
    priceId: prices[0].id,
  })

  return {
    props: {
      clientSecret:
        stripeSubscription.latest_invoice.payment_intent.client_secret,
      prices: prices.sort((a, b) => a.unit_amount - b.unit_amount),
    },
  }
}
