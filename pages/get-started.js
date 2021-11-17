import React, { useCallback, useMemo, useState } from 'react'
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
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  const checkSimilarHost = async (customHost) => {
    try {
      const { data } = await axios.get(`/api/restaurants?similar=${customHost}`)
      let count = 0
      let out = customHost
      const slugs = data.map((d) => d.slug)
      if (slugs) {
        while (slugs.includes(out)) {
          out = `${customHost}-${count + 1}`
          count++
        }
      }
      await checkUniqueHost(out)
      return out
    } catch (error) {
      alert(error)
    }
  }

  const checkUniqueHost = async (customHost) => {
    if (customHost) {
      try {
        const { data } = await axios.get(
          `/api/restaurants?customHost=${customHost}`,
          {
            customHost,
          }
        )
        setIsCheckingSlug(false)
        if (data.length) {
          setSlugMessage({
            type: 'error',
            message: `${customHost} is already taken.`,
          })
        } else {
          setSlugMessage({
            type: 'success',
            message: `${customHost} is available!`,
          })
        }
      } catch (error) {
        setIsCheckingSlug(false)
        alert(error)
      }
    } else {
      setIsCheckingSlug(false)
      setSlugMessage(null)
    }
  }

  const handleDebounce = useMemo(() => debounce(checkUniqueHost, 500), [])

  const debouncedCheckUniqueHost = useCallback(
    (customHost) => {
      setIsCheckingSlug(true)
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

  const onSubmit = async (form) => {
    try {
      const [name, customHost] = getValues(['restaurantName', 'customHost'])
      setIsSubmitting(true)
      await postRestaurant({
        userId: user.id,
        name,
        customHost,
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
      <Container maxW="container.xl" py="24">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem
            colStart={{ md: '3', xl: '4' }}
            colSpan={{ md: '8', xl: '6' }}
          >
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
                          onChange={(e) =>
                            debouncedCheckUniqueHost(e.target.value)
                          }
                          autoComplete="off"
                        />
                        <InputRightAddon>.getthemenu.io</InputRightAddon>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.customHost?.message}
                      </FormErrorMessage>
                      {isCheckingSlug && (
                        <Alert status="info" mt="2">
                          <Spinner />
                          Checking availability...
                        </Alert>
                      )}
                      {!isCheckingSlug && slugMessage && (
                        <Alert status={slugMessage.type} mt="2">
                          <AlertIcon />
                          {slugMessage.message}
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
                      loadingText="Submitting..."
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
