import { env } from '@/utils/env'
import { getErrorMessage } from '@/utils/functions'
import { createClientComponent } from '@/utils/supabase/component'
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
  Text
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

interface FormData {
  email: string
}

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClientComponent()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase.auth.resetPasswordForEmail(
        form.email,
        {
          redirectTo: `${env.BASE_URL}/reset-password`,
        },
      )
      if (error)
        throw new Error(error.message)
      setIsSubmitting(false)
      setSuccess(true)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <Container maxW="container.lg" py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: 4 }} colSpan={{ md: 6 }}>
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
                    <Field.Root id="email" invalid={!!errors.email}>
                      <Field.Label>Your Email</Field.Label>
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
                  {success && (
                    <GridItem>
                      <Alert.Root status="success">
                        <Alert.Indicator />
                        Instructions with how to create a new password have been
                        sent to your email.
                      </Alert.Root>
                    </GridItem>
                  )}
                  <GridItem display="flex">
                    <Flex align="center">
                      <NextLink href="/login" passHref>
                        <Link
                          fontWeight="semibold"
                          colorScheme="blue"
                        >
                          Back to Login
                        </Link>
                      </NextLink>
                    </Flex>
                    <Button
                      ml="auto"
                      loading={isSubmitting}
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
