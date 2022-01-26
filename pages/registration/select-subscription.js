import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'
import initStripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
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
import router from 'next/router'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function SelectSubscription({ prices }) {
  const methods = useForm({
    defaultValues: {
      priceId: prices[0].id,
    },
  })

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
            <Elements stripe={stripePromise}>
              <PaymentForm prices={prices} />
            </Elements>
          </FormProvider>
        </Box>
      </Container>
    </Box>
  )
}

const PaymentForm = ({ prices }) => {
  const stripe = useStripe()
  const elements = useElements()

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stripeError, setStripeError] = useState(null)
  const [cardError, setCardError] = useState(null)

  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext()

  const onSubmit = async (form) => {
    if (!stripe || !elements) {
      return
    }
    setIsSubmitting(true)

    const { data } = await axios.post('/api/stripe/create-subscription', {
      user,
      priceId: form.priceId,
    })

    const { error: paymentError } = await stripe.confirmCardPayment(
      data.clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    )

    if (paymentError) {
      if (
        paymentError?.type === 'card_error' ||
        paymentError?.type === 'validation_error'
      ) {
        setStripeError(paymentError)
      } else {
        setStripeError({ message: 'An unexpected error occured.' })
      }
      setIsSubmitting(false)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <Box>
            <FormControl as="fieldset" id="price" isInvalid={errors.price}>
              <FormLabel as="legend">Select a Subscription Level</FormLabel>
              <Controller
                name="priceId"
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
            <FormControl isInvalid={stripeError || cardError}>
              <FormLabel>
                Card Details
                <CardElement
                  onChange={(e) => {
                    setCardError(e.error)
                  }}
                />
              </FormLabel>
              <FormErrorMessage>
                {stripeError?.message || cardError?.message}
              </FormErrorMessage>
            </FormControl>
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

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)
  const { data: prices } = await stripe.prices.list()

  return {
    props: {
      prices: prices.sort((a, b) => a.unit_amount - b.unit_amount),
    },
  }
}
