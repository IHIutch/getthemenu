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
  Alert,
  AlertIcon,
  Center,
  Spinner,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import supabase from '@/utils/supabase'
import { useAuthUser } from '@/utils/react-query/user'
import { getLoggedUser } from '@/utils/supabase/auth'

export default function ResetPassword({ sessionUser }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    data: user,
    isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log({ event, session })
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.api.updateUser('', {
        password: form['new-password'],
      })
      if (error) throw new Error(error.message)
      setIsSubmitting(false)
      setSuccess(true)

      router.replace('/dashboard')
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
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
          <GridItem colStart={{ md: '4' }} colSpan={{ md: '6' }}>
            {!isUserLoading && user ? (
              <Box bg="white" borderWidth="1px" rounded="md" p="8">
                <Box mb="8">
                  <Heading as="h1">Reset Password</Heading>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid gap="6">
                    <GridItem>
                      <FormControl
                        id="password"
                        isInvalid={errors['new-password']}
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
                    <GridItem d="flex">
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
            ) : (
              <Center w="full" h="20">
                <Spinner />
              </Center>
            )}
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}

export const getServerSideProps = async (req) => {
  const sessionUser = await getLoggedUser(req)
  return {
    props: {
      sessionUser,
    },
  }
}
