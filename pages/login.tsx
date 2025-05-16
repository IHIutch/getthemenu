import type { GetServerSidePropsContext } from 'next'
import type { SubmitHandler } from 'react-hook-form'

import SEO from '@/components/global/SEO'
import { getErrorMessage } from '@/utils/functions'
import { getSupabaseBrowserClient } from '@/utils/supabase/component'
import { getSupabaseServerClient } from '@/utils/supabase/server-props'
import {
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
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error)
        throw new Error(error.message)
      console.log('Logged in successfully')
      router.push('/dashboard')
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Head>
        <SEO title="Log In" />
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
                  Log In
                </Heading>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <Field.Root id="email" invalid={!!errors.email}>
                      <Field.Label>Email address</Field.Label>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                        autoComplete="email"
                        required
                      />
                      <Field.ErrorText>
                        {errors.email?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root id="password" invalid={!!errors.password}>
                      <Field.Label>Password</Field.Label>
                      <Input
                        {...register('password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="current-password"
                        required
                      />
                      <Field.ErrorText>
                        {errors.password?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem display="flex">
                    <Flex align="center">
                      <Link
                        fontWeight="semibold"
                        colorScheme="blue"
                        asChild
                      >
                        <NextLink href="/forgot-password">
                          Forgot Password?
                        </NextLink>
                      </Link>
                    </Flex>
                    <Button
                      ml="auto"
                      loading={isSubmitting}
                      colorScheme="blue"
                      type="submit"
                    >
                      Log In
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            </Box>
            <Box textAlign="center" mt="6">
              <Link asChild colorScheme="blue">
                <NextLink href="/register">
                  Don&rsquo;t Have an Account? Register Now!
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

  if (data.user) {
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
