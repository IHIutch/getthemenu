import * as React from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Container,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'

import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { createClientServer } from '@/utils/supabase/server-props'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server'
import SuperJSON from 'superjson'
import { createClientComponent } from '@/utils/supabase/component'
import { getErrorMessage } from '@/utils/functions'

type FormData = {
  'new-password': string
}

export default function ResetPassword({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()
  const supabase = createClientComponent()

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log({ event, session })
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      'new-password': ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.updateUser({
        password: form['new-password'],
      })
      if (error) throw new Error(error.message)
      setIsSubmitting(false)
      setSuccess(true)

      router.replace('/dashboard')
    } catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.lg" py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: 4 }} colSpan={{ md: 6 }}>
            <Box bg="white" borderWidth="1px" rounded="md" p="8">
              <Box mb="8">
                <Heading as="h1">Reset Password</Heading>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <FormControl
                      id="password"
                      isInvalid={!!errors['new-password']}
                    >
                      <FormLabel>New Password</FormLabel>
                      <Input
                        {...register('new-password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="new-password"
                      />
                      <FormErrorMessage>
                        {errors['new-password']?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  {success && (
                    <GridItem>
                      <Alert status="success">
                        <AlertIcon />
                        You have successfully updated your password.
                      </Alert>
                    </GridItem>
                  )}
                  <GridItem display="flex">
                    <Flex align="center">
                      <Button
                        as={NextLink}
                        href="/"
                        variant="link"
                        fontWeight="semibold"
                        colorScheme="blue"
                      >
                        Back to Login
                      </Button>
                    </Flex>
                    <Button
                      ml="auto"
                      isLoading={isSubmitting}
                      colorScheme="blue"
                      type="submit"
                    >
                      Reset Password
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
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

  return {
    props: {
      user,
      trpcState: helpers.dehydrate(),
    },
  }
}
