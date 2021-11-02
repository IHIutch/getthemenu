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
import { useForm } from 'react-hook-form'
import axios from 'redaxios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useAuthUser } from '@/utils/react-query/user'

export default function Login() {
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
      const { error } = await supabase.auth.signIn({
        email: form.email,
        password: form.password,
      })
      if (error) throw new Error(error.message)
      router.replace('/dashboard')
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
    }
  }

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [router, user])

  return (
    <>
      <Head>
        <title>GetTheMenu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem
            colStart={{ md: '4', lg: '5' }}
            colSpan={{ md: '6', lg: '4' }}
          >
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
                      loadingText="Logging In..."
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
              <NextLink href="/register" passHref>
                <Button as={Link} colorScheme="blue" variant="link">
                  Don't Have an Account? Register Now!
                </Button>
              </NextLink>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
