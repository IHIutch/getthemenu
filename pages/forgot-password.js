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
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import Container from '@/components/common/Container'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import supabase from '@/utils/supabase'

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { query } = useRouter()
  const { access_token } = query

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.api.updateUser(access_token, {
        password: form['new-password'],
      })
      if (error) throw new Error(error.message)
      setIsSubmitting(false)
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
      <Container py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem
            colStart={{ md: '3', xl: '4' }}
            colSpan={{ md: '8', xl: '6' }}
          >
            <Box bg="white" borderWidth="1px" rounded="md" p="8">
              <Box mb="8">
                <Heading as="h1">Reset Password</Heading>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  {/* <GridItem>
                    <FormControl id="email" isInvalid={errors.email}>
                      <FormLabel>Email</FormLabel>
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
                  </GridItem> */}
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
