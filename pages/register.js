import React, { useEffect, useState } from 'react'
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
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Container,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { useAuthUser } from '@/utils/react-query/user'
import NextLink from 'next/link'

export default function Register() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const [fullName] = getValues(['fullName'])
        await axios.post(`/api/auth/register`, {
          event,
          session,
          // Any additional user data
          userData: {
            fullName,
          },
        })
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [getValues])

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form['new-password'],
      })
      if (error) throw new Error(error.message)
      router.replace('/get-started')
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
      router.replace('/get-started')
    }
  }, [router, user])

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.md" py="24">
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
                  Register
                </Heading>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <FormControl id="fullName" isInvalid={errors.email}>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        {...register('fullName', {
                          required: 'This field is required',
                        })}
                        type="text"
                        autoComplete="name"
                      />
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="email" isInvalid={errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                        autoComplete="email"
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      id="password"
                      isInvalid={errors['new-password']}
                    >
                      <FormLabel>Password</FormLabel>
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
                  <GridItem>
                    <FormControl
                      id="confirmPassword"
                      isInvalid={errors['confirm-password']}
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        {...register('confirm-password', {
                          required: 'This field is required',
                        })}
                        type="password"
                        autoComplete="new-password"
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
                      loadingText="Registering..."
                      isFullWidth
                      isLoading={isSubmitting}
                    >
                      Register
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            </Box>
            <Box textAlign="center" mt="6">
              <NextLink href="/" passHref>
                <Button as={Link} colorScheme="blue" variant="link">
                  Have an Account? Log In Here!
                </Button>
              </NextLink>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
