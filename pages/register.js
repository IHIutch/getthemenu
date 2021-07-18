import React, { useEffect } from 'react'
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
} from '@chakra-ui/react'
import { Formik, useFormikContext } from 'formik'
import Container from '@/components/common/Container'
import { useAuthUser } from '@/utils/swr/user'

export default function Register() {
  const router = useRouter()
  const {
    values: { email, password },
  } = useFormikContext()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await axios.post(`/api/auth/register`, {
          event,
          session,
          userData: {
            email,
            password,
          },
        })
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [email, password])

  const handleSubmit = async ({ email, password }) => {
    try {
      await supabase.auth.signUp({
        email: email,
        password: password,
      })
    } catch (error) {
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
        <title>Register</title>
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
                <Heading as="h1">Create Account</Heading>
              </Box>
              <Formik
                initialValues={{ email: '', password: '' }}
                validate={(values) => {
                  const errors = {}
                  if (!values.email) errors.email = 'Required'
                  if (!values.password) errors.password = 'Required'
                  return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                  handleSubmit(values)
                  setSubmitting(false)
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid gap="6">
                      <GridItem>
                        <FormControl
                          id="email"
                          isInvalid={errors.email && touched.email}
                        >
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            isRequired
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl
                          id="password"
                          isInvalid={errors.password && touched.password}
                        >
                          <FormLabel>Password</FormLabel>
                          <Input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            isRequired
                          />
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <Button
                          ml="auto"
                          type="submit"
                          colorScheme="blue"
                          loadingText="Registering..."
                          isLoading={isSubmitting}
                        >
                          Register
                        </Button>
                      </GridItem>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
