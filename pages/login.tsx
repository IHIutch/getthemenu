import React, { useEffect, useState } from 'react'
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
  Link,
  Container,
} from '@chakra-ui/react'

import Head from 'next/head'
import { SubmitHandler, useForm } from 'react-hook-form'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useAuthUser } from '@/utils/react-query/user'
import { getErrorMessage } from '@/utils/functions'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import SEO from '@/components/global/SEO'

type FormValues = {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const {
    data: user,
    isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  // Doing this client side because of https://github.com/supabase/supabase/issues/3783
  useEffect(() => {
    if (!isUserLoading) {
      if (user && user.restaurants?.length === 0) {
        router.replace('/get-started')
      } else if (user) {
        router.replace('/dashboard')
      }
    }
  }, [isUserLoading, router, user])

  const { data: authListener } = supabaseClient.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN') {
        await axios.post(`/api/auth/signin`, {
          event,
          session,
        })
        router.replace('/dashboard')
      }
    }
  )

  authListener.subscription.unsubscribe()

  const onSubmit: SubmitHandler<FormValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw new Error(error.message)
    } catch (error) {
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
                    <FormControl id="email" isInvalid={!!errors.email}>
                      <FormLabel>Email address</FormLabel>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                        autoComplete="email"
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="password" isInvalid={!!errors.password}>
                      <FormLabel>Password</FormLabel>
                      <Input
                        {...register('password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="current-password"
                        isRequired
                      />
                      <FormErrorMessage>
                        {errors.password?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem display="flex">
                    <Flex align="center">
                      <Button
                        as={NextLink}
                        href={'/forgot-password'}
                        variant="link"
                        fontWeight="semibold"
                        colorScheme="blue"
                      >
                        Forgot Password?
                      </Button>
                    </Flex>
                    <Button
                      ml="auto"
                      isLoading={isSubmitting}
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
              <Button as={NextLink} href="/register" colorScheme="blue" variant="link">
                Don&rsquo;t Have an Account? Register Now!
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}