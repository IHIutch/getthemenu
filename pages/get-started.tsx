import * as React from 'react'
import Head from 'next/head'
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
import { SubmitHandler, useForm } from 'react-hook-form'

import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import SuperJSON from 'superjson'
import { appRouter } from '@/server'
import { createClientServer } from '@/utils/supabase/server-props'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getErrorMessage } from '@/utils/functions'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/utils/trpc/client'
import { slug as slugify } from 'github-slugger'

const FormPayload = z.object({
  restaurantName: z.string(),
  customHost: z.string().max(63)
})

type FormData = z.infer<typeof FormPayload>

type SlugMessageType = {
  type: 'success' | 'error'
  message: string
} | null

export default function GetStarted({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [slugMessage, setSlugMessage] = React.useState<SlugMessageType>(null)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormPayload)
  })

  const { mutateAsync: handleCheckCustomHost, isPending: isChecking } = trpc.verify.checkCustomHost.useMutation()
  const { mutateAsync: handleCreateRestaurant, isPending: isSubmitting } = trpc.restaurant.create.useMutation()

  const debouncedCheckUniqueHost = React.useMemo(
    () => debounce(async (customHost: string) => {
      try {
        const testHost = slugify(customHost, false)

        if (testHost.length > 63) {
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
          const suggestion = await handleCheckCustomHost({ customHost })

          if (suggestion) {
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
      } catch (error) {
        alert(getErrorMessage(error))
      }
    }, 500),
    [handleCheckCustomHost]
  )

  const handleSetHost = async () => {
    try {
      const [name, customHost] = getValues(['restaurantName', 'customHost'])
      if (name && !customHost) {
        // 63 is the max length of a customHost
        const newHost = slugify(name.slice(0, 63), false)
        const suggestion = await handleCheckCustomHost({ customHost: newHost })
        setValue('customHost', suggestion || newHost, { shouldDirty: true, shouldTouch: false })
      }
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  const checkUniqueHost = () => {
    const customHost = getValues('customHost')
    if (customHost) {
      debouncedCheckUniqueHost(customHost)
    } else {
      setSlugMessage(null)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      const { restaurantName, customHost } = form
      await handleCreateRestaurant({
        payload: {
          userId: user.id,
          name: restaurantName || '',
          customHost: slugify(customHost || '', false),
          customDomain: null
        }
      }, {
        onSuccess() {
          router.replace('/dashboard')
        },
        onError(error) {
          throw new Error(getErrorMessage(error))
        }
      })
    } catch (error) {
      alert(getErrorMessage(error))
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
          <GridItem colStart={{ md: 4 }} colSpan={{ md: 6 }}>
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
                      isInvalid={!!errors.restaurantName}
                    >
                      <FormLabel>Restaurant Name</FormLabel>
                      <Input
                        {...register('restaurantName', {
                          required: 'This field is required',
                          onBlur: handleSetHost,
                        })}
                        type="text"
                        autoComplete="off"
                      />
                      <FormErrorMessage>
                        {errors.restaurantName?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl id="customHost" isInvalid={!!errors.customHost}>
                      <FormLabel>Choose a Unique URL</FormLabel>
                      <InputGroup>
                        <Input
                          {...register('customHost', {
                            required: 'This field is required',
                            onChange: checkUniqueHost
                          })}
                          type="text"
                          autoComplete="off"
                        />
                        <InputRightAddon>.getthemenu.io</InputRightAddon>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.customHost?.message}
                      </FormErrorMessage>
                      {isChecking ? (
                        <Alert status="info" mt="2">
                          <Spinner size="sm" />
                          <Text ml="2">Checking availability...</Text>
                        </Alert>
                      ) : !isChecking && slugMessage ? (
                        <Alert status={slugMessage.type} mt="2">
                          <AlertIcon />
                          <Text ml="2">{slugMessage.message}</Text>
                        </Alert>
                      ) : null}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      supabase
    },
    transformer: SuperJSON,
  });

  const user = await helpers.user.getAuthedUser.fetch()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else if (user.restaurants.length > 0) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
      trpcState: helpers.dehydrate(),
    },
  }
}
