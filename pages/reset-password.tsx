import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import type { SubmitHandler } from 'react-hook-form'
import { appRouter } from '@/server'
import { getErrorMessage } from '@/utils/functions'

import { createClientComponent } from '@/utils/supabase/component'
import { createClientServer } from '@/utils/supabase/server-props'
import {
  Alert,
  Box,
  Button,
  Container,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
} from '@chakra-ui/react'
import { createServerSideHelpers } from '@trpc/react-query/server'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import SuperJSON from 'superjson'

interface FormData {
  'new-password': string
}

export default function ResetPassword(_props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()
  const supabase = createClientComponent()

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log({ event, session })
      },
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
      'new-password': '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.updateUser({
        password: form['new-password'],
      })
      if (error)
        throw new Error(error.message)
      setIsSubmitting(false)
      setSuccess(true)

      router.replace('/dashboard')
    }
    catch (error) {
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
                    <Field.Root
                      id="password"
                      invalid={!!errors['new-password']}
                    >
                      <Field.Label>New Password</Field.Label>
                      <Input
                        {...register('new-password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="new-password"
                      />
                      <Field.ErrorText>
                        {errors['new-password']?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  {success && (
                    <GridItem>
                      <Alert.Root status="success">
                        <Alert.Indicator />
                        <Alert.Description>You have successfully updated your password.</Alert.Description>
                      </Alert.Root>
                    </GridItem>
                  )}
                  <GridItem display="flex">
                    <Flex align="center">
                      <Link
                        fontWeight="semibold"
                        colorScheme="blue"
                        asChild
                      >
                        <NextLink href="/login">
                          Back to Login
                        </NextLink>
                      </Link>
                    </Flex>
                    <Button
                      ml="auto"
                      loading={isSubmitting}
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
  const { data } = await supabase.auth.getUser()

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: {
        user: data.user,
      },
    },
    transformer: SuperJSON,
  })

  const user = await helpers.user.getAuthedUser.fetch()

  if (user?.restaurants.length === 0) {
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
