import React from 'react'
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
import { Formik } from 'formik'
import Container from '@/components/common/Container'
import Head from 'next/head'

export default function LogIn() {
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
              <Formik
                initialValues={{ email: '', password: '' }}
                validate={(values) => {
                  const errors = {}
                  if (!values.email) errors.email = 'Required'
                  if (!values.password) errors.password = 'Required'
                  return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    alert(JSON.stringify(values, null, 2))
                    setSubmitting(false)
                  }, 400)
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
                          loadingText="Logging In..."
                          isLoading={isSubmitting}
                        >
                          Log In
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
