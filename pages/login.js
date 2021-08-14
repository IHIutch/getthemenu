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
} from '@chakra-ui/react'
import Container from '@/components/common/Container'
import Head from 'next/head'
import supabase from '@/utils/supabase'
import { useAuthUser } from '@/utils/swr/user'
import { useForm } from 'react-hook-form'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

export default function LogIn() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        axios.post(`/api/auth/signin`, {
          event,
          session,
        })
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      await supabase.auth.signIn({
        email: form.email,
        password: form.password,
      })
      router.push('/profile')
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
    }
  }

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useAuthUser({})

  useEffect(() => {
    if (user) {
      router.replace('/profile')
    }
  }, [router, user])

  return (
    <>
      <Head>
        <title>Log In</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem
            colStart={{ md: '3', xl: '4' }}
            colSpan={{ md: '8', xl: '6' }}
          >
            <Box bg="white" borderWidth="1px" rounded="md" p="8">
              <Box mb="8">
                <Heading as="h1">Log In</Heading>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <FormControl id="email" isInvalid={errors.email}>
                      <FormLabel>Email address</FormLabel>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                      />
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="password" isInvalid={errors.password}>
                      <FormLabel>Password</FormLabel>
                      <Input
                        {...register('password', {
                          required: 'This field is required',
                        })}
                        type="password"
                      />
                      <FormErrorMessage>
                        {errors.password?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem d="flex">
                    <Flex align="center">
                      <NextLink href={'/forgot-password'} passHref>
                        <Button
                          as={Link}
                          variant="link"
                          fontWeight="semibold"
                          colorScheme="blue"
                        >
                          Forgot Password?
                        </Button>
                      </NextLink>
                    </Flex>
                    <Button
                      ml="auto"
                      isLoading={isSubmitting}
                      colorScheme="blue"
                      type="submit"
                    >
                      Sign In
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
