import type { GetServerSidePropsContext } from 'next'
import type { SubmitHandler } from 'react-hook-form'

import { getErrorMessage } from '@/utils/functions'
import { getSupabaseBrowserClient } from '@/utils/supabase/component'
import { getSupabaseServerClient } from '@/utils/supabase/server-props'
import { trpc } from '@/utils/trpc'
import {
  Box,
  Button,
  Container,
  Field,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  'fullName': string
  'email': string
  'new-password': string
  'confirm-password': string
}

export default function Register() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const supabase = getSupabaseBrowserClient()

  const { mutateAsync: handleSetUpNewAccount } = trpc.user.setUpNewAccount.useMutation()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>()

  // const { data: authListener } = supabase.auth.onAuthStateChange(
  // async (event, session) => {
  //   // if (event === 'SIGNED_IN' && session && session.user.email) {
  //   //   const fullName = getValues('fullName')
  //   // }
  // },
  // )

  // authListener.subscription.unsubscribe()

  const onSubmit: SubmitHandler<FormValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error, data } = await supabase.auth.signUp({
        email: form.email,
        password: form['new-password'],
      })
      if (error)
        throw new Error(error.message)

      if (data.user) {
        await handleSetUpNewAccount({
          payload: {
            email: form.email,
            fullName: form.fullName,
          },
        }, {
          onSuccess() {
            router.replace('/onboarding/setup')
          },
        })
      }
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Head>
        <title>Create Your Restaurant</title>
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
                    <Field.Root id="fullName" invalid={!!errors.email}>
                      <Field.Label>Your Name</Field.Label>
                      <Input
                        {...register('fullName', {
                          required: 'This field is required',
                        })}
                        type="text"
                        autoComplete="name"
                        required
                      />
                      <Field.ErrorText>
                        {errors.email?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root id="email" invalid={!!errors.email}>
                      <Field.Label>Your Email</Field.Label>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                        autoComplete="email"
                        required
                      />
                      <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root
                      id="password"
                      invalid={!!errors['new-password']}
                    >
                      <Field.Label>Password</Field.Label>
                      <Input
                        {...register('new-password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="new-password"
                        required
                      />
                      <Field.ErrorText>
                        {errors['new-password']?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root
                      id="confirmPassword"
                      invalid={!!errors['confirm-password']}
                    >
                      <Field.Label>Confirm Password</Field.Label>
                      <Input
                        {...register('confirm-password', {
                          required: 'This field is required',
                          validate: value =>
                            value === getValues('new-password')
                            || 'Passwords must match',
                        })}
                        type="password"
                        autoComplete="new-password"
                        required
                      />
                      <Field.ErrorText>
                        {errors['confirm-password']?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Button
                      ml="auto"
                      type="submit"
                      colorScheme="blue"
                      w="full"
                      loadingText="Registering..."
                      loading={isSubmitting}
                    >
                      Register
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            </Box>
            <Box textAlign="center" mt="6">
              <Link colorScheme="blue" asChild>
                <NextLink href="/login">
                  Have an Account? Log In Here!
                </NextLink>
              </Link>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = getSupabaseServerClient(context)
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  // else if (user.restaurants.length === 0) {
  //   return {
  //     redirect: {
  //       destination: '/onboarding/setup',
  //       permanent: false,
  //     },
  //   }
  // }
  // else if (user.restaurants.length > 0) {
  //   return {
  //     redirect: {
  //       destination: '/dashboard',
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {},
  }
}
