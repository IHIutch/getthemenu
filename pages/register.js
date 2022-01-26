import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import supabase from '@/utils/supabase'
import axios from 'redaxios'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Container,
  Stack,
  RadioGroup,
  Radio,
  useStyleConfig,
  Center,
  Text,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import NextLink from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import initStripe from 'stripe'
import { getUser } from '@/utils/axios/users'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Register({ prices }) {
  // TODO: Use getServerSideProps for this
  //   useEffect(() => {
  //     if (user) {
  //       router.replace('/dashboard')
  //     }
  //   }, [router, user])

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.sm" py="24">
        <Box mb="6" textAlign="center">
          <Heading as="h1" fontSize="4xl">
            GetTheMenu
          </Heading>
        </Box>
        <Box bg="white" borderWidth="1px" rounded="md" p="8">
          <Box mb="8">
            <Heading as="h2" fontSize="3xl" mb="2">
              Register
            </Heading>
          </Box>

          <Elements stripe={stripePromise}>
            <RegistrationForm prices={prices} />
          </Elements>
        </Box>
        <Box textAlign="center" mt="6">
          <NextLink href="/" passHref>
            <Button as={Link} colorScheme="blue" variant="link">
              Have an Account? Log In Here!
            </Button>
          </NextLink>
        </Box>
      </Container>
    </>
  )
}

const RegistrationForm = ({ prices }) => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [isFocused, setIsFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardError, setCardError] = useState(null)
  const [registrationError, setRegistrationError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priceId: prices[0].id,
    },
  })

  const handleSupabaseSignup = async (form) => {
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form['new-password'],
    })
    if (error) throw new Error(error.message)
  }

  const handleStripeConfirm = useCallback(
    async (user, priceId) => {
      const { data, error } = await axios.post(
        '/api/stripe/create-subscription',
        {
          customerId: user.stripeCustomerId,
          priceId,
        }
      )
      if (error) {
        throw new Error(error.message)
      }

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
          throw new Error(paymentError.message)
        } else {
          throw new Error('An unexpected error occured.')
        }
      }
    },
    [elements, stripe]
  )

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          await axios.post(`/api/auth/register`, {
            event,
            session,
            // Any additional user data
            payload: {
              // fullName,
            },
          })
          const user = await getUser(session.user.id)
          const priceId = getValues('priceId')
          await handleStripeConfirm(user, priceId)
          router.replace('/dashboard')
        } catch (error) {
          alert(error.message)
        }
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [getValues, handleStripeConfirm, router])

  const onSubmit = async (form) => {
    try {
      if (!stripe || !elements) {
        return
      }
      setIsSubmitting(true)
      await handleSupabaseSignup(form)
    } catch (error) {
      setIsSubmitting(false)
      setRegistrationError(error.message)
      alert(error.message)
    }
  }

  const inputStyles = useStyleConfig('Input')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="6">
        <FormControl id="email" isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            {...register('email', {
              required: 'This field is required',
            })}
            type="email"
            autoComplete="email"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl id="password" isInvalid={errors['new-password']}>
          <FormLabel>Password</FormLabel>
          <Input
            {...register('new-password', {
              required: 'This field is required',
            })}
            type="password"
            autoComplete="new-password"
          />
          <FormErrorMessage>{errors['new-password']?.message}</FormErrorMessage>
        </FormControl>
        <FormControl as="fieldset" id="price" isInvalid={errors.price}>
          <FormLabel as="legend">Select a Subscription Level</FormLabel>
          <Controller
            name="priceId"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack>
                  {prices.map((price, idx) => (
                    <Radio key={idx} value={price.id}>
                      ${price.unit_amount / 100} / {price?.recurring?.interval}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          />
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={cardError}>
          <FormLabel>
            <Text mb="1">Card Details</Text>
            <Center
              {...inputStyles.field}
              sx={
                isFocused && {
                  ...inputStyles.field._focus,
                }
              }
            >
              <Box width="100%">
                <CardElement
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  }}
                  onChange={(e) => {
                    setCardError(e.error)
                  }}
                />
              </Box>
            </Center>
          </FormLabel>
          <FormErrorMessage>{cardError?.message}</FormErrorMessage>
        </FormControl>
        <Box>
          <Button
            ml="auto"
            type="submit"
            colorScheme="blue"
            loadingText="Registering..."
            isFullWidth
            isLoading={isSubmitting}
          >
            Register
          </Button>
        </Box>
      </Stack>
    </form>
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
