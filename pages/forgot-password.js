import React, { useState } from 'react'
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
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'

import { useForm } from 'react-hook-form'
import supabase from '@/utils/supabase'

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.api.resetPasswordForEmail(
        form.email,
        {
          redirectTo: 'http://localhost:3000/reset-password',
        }
      )
      if (error) throw new Error(error.message)
      setIsSubmitting(false)
      setSuccess(true)
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
            <Box bg="white" borderWidth="1px" rounded="md" p="8">
              <Box mb="8">
                <Heading as="h1" mb="2">
                  Forgot Password
                </Heading>
                <Text color="gray.700">
                  Enter you email below and we&apos;ll send you an email with
                  instructions about how to reset your password.
                </Text>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <FormControl id="email" isInvalid={errors.email}>
                      <FormLabel>Your Email</FormLabel>
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
                  {success && (
                    <GridItem>
                      <Alert status="success">
                        <AlertIcon />
                        Instructions with how to create a new password have been
                        sent to your email.
                      </Alert>
                    </GridItem>
                  )}
                  <GridItem d="flex">
                    <Flex align="center">
                      <NextLink href={'/'} passHref>
                        <Button
                          as={Link}
                          variant="link"
                          fontWeight="semibold"
                          colorScheme="blue"
                        >
                          Back to Login
                        </Button>
                      </NextLink>
                    </Flex>
                    <Button
                      ml="auto"
                      isLoading={isSubmitting}
                      colorScheme="blue"
                      type="submit"
                    >
                      Submit
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
