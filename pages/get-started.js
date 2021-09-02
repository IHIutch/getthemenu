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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import Container from '@/components/common/Container'
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

  const checkSimilarSubdomain = async (subdomain) => {
    try {
      const { data } = await axios.get(`/api/restaurants?similar=${subdomain}`)
      let count = 0
      let out = subdomain
      const slugs = data.map((d) => d.slug)
      if (slugs) {
        while (slugs.includes(out)) {
          out = `${subdomain}-${count + 1}`
          count++
        }
      }
      await checkUniqueSubdomain(out)
      return out
    } catch (error) {
      alert(error)
    }
  }

  const checkUniqueSubdomain = async (subdomain) => {
    if (subdomain) {
      try {
        const { data } = await axios.get(
          `/api/restaurants?subdomain=${subdomain}`,
          {
            subdomain,
          }
        )
        setIsCheckingSlug(false)
        if (data.length) {
          setSlugMessage({
            type: 'error',
            message: `${subdomain} is already taken.`,
          })
        } else {
          setSlugMessage({
            type: 'success',
            message: `${subdomain} is available!`,
          })
        }
      } catch (error) {
        console.log(error)
        setIsCheckingSlug(false)
        alert(error)
      }
    } else {
      setIsCheckingSlug(false)
      setSlugMessage(null)
    }
  }

  const handleDebounce = useMemo(() => debounce(checkUniqueSubdomain, 500), [])

  const debouncedCheckUniqueSubdomain = useCallback(
    (subdomain) => {
      setIsCheckingSlug(true)
      handleDebounce(subdomain)
    },
    [handleDebounce]
  )

  const handleSetSubdomain = async (e) => {
    const [name, subdomain] = getValues(['restaurantName', 'subdomain'])
    if (name && !subdomain) {
      // 63 is the max length of a subdomain
      const newSubdomain = slugify(name.slice(0, 63), {
        lower: true,
        strict: true,
      })
      const uniqueSubdomain = await checkSimilarSubdomain(newSubdomain)
      setValue('subdomain', uniqueSubdomain, { shouldValidate: true })
    }
  }

  const onSubmit = async (form) => {
    try {
      const [name, subdomain] = getValues(['restaurantName', 'subdomain'])
      setIsSubmitting(true)
      await postRestaurant({
        userId: user.id,
        name,
        subdomain,
      })
      // TODO: Mutate user object to include newly created restaurant. Or on the dashboard, fetch restaurant by ID
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
      <Container py="24">
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
                        onBlur={handleSetSubdomain}
                        autoComplete="off"
                      />
                      <FormErrorMessage>
                        {errors.restaurantName?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="subdomain" isInvalid={errors.subdomain}>
                      <FormLabel>Choose a Unique URL</FormLabel>
                      <InputGroup>
                        <Input
                          {...register('subdomain', {
                            required: 'This field is required',
                          })}
                          type="text"
                          onChange={(e) =>
                            debouncedCheckUniqueSubdomain(e.target.value)
                          }
                          autoComplete="off"
                        />
                        <InputRightAddon children=".getthemenu.io" />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.subdomain?.message}
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
