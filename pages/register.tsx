import * as React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Container,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import NextLink from 'next/link'
import { createClientComponent } from '@/utils/supabase/component'
import { getErrorMessage } from '@/utils/functions'
import { trpc } from '@/utils/trpc/client'
import { createClientServer } from '@/utils/supabase/server-props'
import { createCaller } from '@/utils/trpc/server'
import { GetServerSidePropsContext } from 'next'

type FormValues = {
  fullName: string,
  email: string
  'new-password': string,
  'confirm-password': string
}

export default function Register() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const supabase = createClientComponent()

  const { mutateAsync: handleSetUpNewAccount } = trpc.user.setUpNewAccount.useMutation()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>()

  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session && session.user.email) {
        const fullName = getValues('fullName')

      }
    }
  )

  authListener.subscription.unsubscribe()

  const onSubmit: SubmitHandler<FormValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error, data: { user } } = await supabase.auth.signUp({
        email: form.email,
        password: form['new-password'],
      })
      if (error) throw new Error(error.message)

      if (user) {
        await handleSetUpNewAccount({
          payload: {
            id: user.id,
            email: form.email,
            fullName: form.fullName
          }
        }, {
          onSuccess() {
            router.replace('/get-started')
          }
        })
      }
    } catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.lg" py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: 4 }} colSpan={{ md: 6 }}>
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

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <FormControl id="fullName" isInvalid={!!errors.email}>
                      <FormLabel>Your Name</FormLabel>
                      <Input
                        {...register('fullName', {
                          required: 'This field is required',
                        })}
                        type="text"
                        autoComplete="name"
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="email" isInvalid={!!errors.email}>
                      <FormLabel>Your Email</FormLabel>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                        autoComplete="email"
                        isRequired
                      />
                      <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="password"
                      isInvalid={!!errors['new-password']}
                    >
                      <FormLabel>Password</FormLabel>
                      <Input
                        {...register('new-password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="new-password"
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors['new-password']?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="confirmPassword"
                      isInvalid={!!errors['confirm-password']}
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        {...register('confirm-password', {
                          required: 'This field is required',
                          validate: (value) =>
                            value === getValues('new-password') ||
                            'Passwords must match',
                        })}
                        type="password"
                        autoComplete="new-password"
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors['confirm-password']?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <Button
                      ml="auto"
                      type="submit"
                      colorScheme="blue"
                      w="full"
                      loadingText="Registering..."
                      isLoading={isSubmitting}
                    >
                      Register
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            </Box>
            <Box textAlign="center" mt="6">
              <Button as={NextLink} href="/" colorScheme="blue" variant="link">
                Have an Account? Log In Here!
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return {
      props: {},
    }
  }
  const caller = createCaller({
    session: {
      user: data.user
    }
  })
  const user = await caller.user.getAuthedUser()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else if (user.restaurants.length === 0) {
    return {
      redirect: {
        destination: '/get-started',
        permanent: false,
      },
    }
  } else if (user.restaurants.length > 0) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
