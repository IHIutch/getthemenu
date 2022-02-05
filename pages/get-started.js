import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import axios from 'redaxios'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  Container,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import slugify from 'slugify'
import { debounce } from 'lodash'
import { postRestaurant } from '@/utils/axios/restaurants'
import { useAuthUser } from '@/utils/react-query/user'
import { useRouter } from 'next/router'

export default function GetStarted() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugMessage, setSlugMessage] = useState(null)

  const {
    data: user,
    isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  // Doing this client side because of https://github.com/supabase/supabase/issues/3783
  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.replace('/')
      } else if (user?.restaurants?.length) {
        router.replace('/dashboard')
      }
    }
  }, [isUserLoading, router, user])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const checkSimilarHost = async (customHost) => {
    try {
      const { data: hosts } = await axios.get(
        `/api/verify/restaurants?customHost=${customHost}`
      )
      let count = 0
      let suggestion = customHost
      if (hosts) {
        while (hosts.map((h) => h.customHost).includes(suggestion)) {
          suggestion = `${customHost}-${count + 1}`
          count++
        }
      }
      debouncedCheckUniqueHost(suggestion)
      return suggestion
    } catch (error) {
      alert(error)
    }
  }

  const checkUniqueHost = useCallback(
    async (customHost) => {
      try {
        const testHost = slugify(customHost, {
          lower: true,
          strict: true,
        })
        setIsCheckingSlug(true)
        if (!customHost) {
          setSlugMessage(null)
        } else if (testHost > 63) {
          setSlugMessage({
            type: 'error',
            message: `Your URL is too long. Please shorten it to 63 characters or less.`,
          })
        } else if (testHost !== customHost) {
          setSlugMessage({
            type: 'error',
            message: `Your URL is not valid. Please use only lowercase letters, numbers, and dashes.`,
          })
        } else {
          const { data } = await axios.get(
            `/api/restaurants?customHost=${customHost}`,
            {
              customHost,
            }
          )
          if (data.length) {
            setSlugMessage({
              type: 'error',
              message: `Sorry, '${customHost}' is taken. Please choose another.`,
            })
          } else {
            setSlugMessage({
              type: 'success',
              message: `'${customHost}' is available!`,
            })
          }
        }
        setIsCheckingSlug(false)
      } catch (error) {
        setIsCheckingSlug(false)
        alert(error.message)
      }
    },
    [setIsCheckingSlug]
  )

  const handleDebounce = useMemo(
    () => debounce(checkUniqueHost, 500),
    [checkUniqueHost]
  )

  const debouncedCheckUniqueHost = useCallback(
    (customHost) => {
      handleDebounce(customHost)
    },
    [handleDebounce]
  )

  const handleSetHost = async (e) => {
    const [name, customHost] = getValues(['restaurantName', 'customHost'])
    if (name && !customHost) {
      // 63 is the max length of a customHost
      const newHost = slugify(name.slice(0, 63), {
        lower: true,
        strict: true,
      })
      const uniqueHost = await checkSimilarHost(newHost)
      setValue('customHost', uniqueHost, { shouldValidate: true })
    }
  }

  const watchCustomHost = watch('customHost')
  useEffect(() => {
    if (watchCustomHost) {
      debouncedCheckUniqueHost(watchCustomHost)
    } else {
      setSlugMessage(null)
    }
  }, [debouncedCheckUniqueHost, watchCustomHost])

  const onSubmit = async (form) => {
    try {
      const { restaurantName, customHost } = form
      setIsSubmitting(true)
      await postRestaurant({
        userId: user.id,
        name: restaurantName || '',
        customHost: slugify(customHost || '', { lower: true, strict: true }),
      })
      router.replace('/dashboard')
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.lg" py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: '4' }} colSpan={{ md: '6' }}>
            <Box bg="white" borderWidth="1px" rounded="md" p="8">
              <Box mb="8">
                <Heading as="h1">Finish Your Account</Heading>
                <Text color="gray.700">
                  Create your restaurant to finish setting up your account.
                </Text>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <FormControl
                      id="restaurantName"
                      isInvalid={errors.restaurantName}
                    >
                      <FormLabel>Restaurant Name</FormLabel>
                      <Input
                        {...register('restaurantName', {
                          required: 'This field is required',
                        })}
                        type="text"
                        onBlur={handleSetHost}
                        autoComplete="off"
                      />
                      <FormErrorMessage>
                        {errors.restaurantName?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="customHost" isInvalid={errors.customHost}>
                      <FormLabel>Choose a Unique URL</FormLabel>
                      <InputGroup>
                        <Input
                          {...register('customHost', {
                            required: 'This field is required',
                          })}
                          type="text"
                          autoComplete="off"
                        />
                        <InputRightAddon>.getthemenu.io</InputRightAddon>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.customHost?.message}
                      </FormErrorMessage>
                      {isCheckingSlug && (
                        <Alert status="info" mt="2">
                          <Spinner size="sm" />
                          <Text ml="2">Checking availability...</Text>
                        </Alert>
                      )}
                      {!isCheckingSlug && slugMessage && (
                        <Alert status={slugMessage.type} mt="2">
                          <AlertIcon />
                          <Text ml="2">{slugMessage.message}</Text>
                        </Alert>
                      )}
                      <FormHelperText>
                        This URL is where your restaurant will be publicly
                        accessible, it must be unique.
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                  {/* <GridItem>
                    <FormControl id="domain" isInvalid={errors.domain}>
                      <FormLabel>Custom Domain</FormLabel>
                      <Input {...register('domain')} type="url" />
                      <FormErrorMessage>{errors.domain}</FormErrorMessage>
                    </FormControl>
                  </GridItem> */}
                  <GridItem textAlign="right">
                    <Button
                      type="submit"
                      colorScheme="blue"
                      loadingText="Creating..."
                      isDisabled={slugMessage?.type === 'error'}
                      isLoading={isSubmitting}
                    >
                      Create Restaurant
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

// export async function getServerSideProps(req) {
//   const user = await getLoggedUser(req)
//   if (!user) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/register',
//       },
//     }
//   }
//   if (user?.restaurants?.length) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/dashboard',
//       },
//     }
//   }

//   return {
//     props: {},
//   }
// }
