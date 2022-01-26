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

export default function Register({ prices }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await axios.post(`/api/auth/register`, {
          event,
          session,
          // Any additional user data
          payload: {
            // fullName,
          },
        })
        router.replace('/registration/select-subscription')
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [router])

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form['new-password'],
      })
      if (error) throw new Error(error.message)
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

  // TODO: Use getServerSideProps for this
  useEffect(() => {
    if (user) {
      router.replace('/registration/select-subscription')
    }
  }, [router, user])

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.lg" py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: '4' }} colSpan={{ md: '6' }}>
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
                    <FormControl id="email" isInvalid={errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        {...register('email', {
                          required: 'This field is required',
                        })}
                        type="email"
                        autoComplete="email"
                      />
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
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
