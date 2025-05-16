import type { GetServerSidePropsContext } from 'next'
import type { SubmitHandler } from 'react-hook-form'

import getServerSideHelpers from '@/server/get-server-side-helpers'
import { getErrorMessage } from '@/utils/functions'
import { getSupabaseServerClient } from '@/utils/supabase/server-props'
import { trpc } from '@/utils/trpc'
import {
  Alert,
  Box,
  Button,
  Container,
  Field,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { slug as slugify } from 'github-slugger'
import debounce from 'lodash/debounce'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormPayload = z.object({
  restaurantName: z.string(),
  customHost: z.string().max(63),
})


type FormData = z.infer<typeof FormPayload>

type SlugMessageType = {
  type: 'success' | 'error'
  message: string
} | null

export default function GetStarted() {
  const router = useRouter()
  const [slugMessage, setSlugMessage] = React.useState<SlugMessageType>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const { data: user } = trpc.user.getAuthedUser.useQuery(undefined, {
    refetchOnMount: false,
  })

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormPayload),
  })

  const { mutateAsync: handleCheckCustomHost, isPending: isChecking } = trpc.verify.checkCustomHost.useMutation()
  const { mutateAsync: handleCreateRestaurant, isPending: isCreating } = trpc.restaurant.create.useMutation()

  const debouncedCheckUniqueHost = React.useMemo(
    () => debounce(async (customHost: string) => {
      try {
        const testHost = slugify(customHost, false)

        if (testHost.length > 63) {
          return setSlugMessage({
            type: 'error',
            message: `Your URL is too long. Please shorten it to 63 characters or less.`,
          })
        }
        if (testHost !== customHost) {
          return setSlugMessage({
            type: 'error',
            message: `Your URL is not valid. Please use only lowercase letters, numbers, and dashes.`,
          })
        }

        const suggestion = await handleCheckCustomHost({ customHost })

        if (suggestion) {
          setSlugMessage({
            type: 'error',
            message: `Sorry, '${customHost}' is taken. Please choose another URL.`,
          })
        }
        else {
          setSlugMessage({
            type: 'success',
            message: `'${customHost}' is available!`,
          })
        }
      }
      catch (error) {
        console.error('Error checking custom host:', getErrorMessage(error))
        setSlugMessage({
          type: 'error',
          message: `Error checking URL availability. Please try again.`,
        })
      }
    }, 500),
    [handleCheckCustomHost],
  )

  const handleSetHost = async () => {
    const [name, customHost] = getValues(['restaurantName', 'customHost'])

    try {
      if (name && !customHost) {
        // 63 is the max length of a customHost
        const newHost = slugify(name.slice(0, 63), false)
        const { suggestion } = await handleCheckCustomHost({ customHost: newHost })
        setValue('customHost', suggestion || newHost, { shouldDirty: false, shouldTouch: false })
      }
    }
    catch (error) {
      alert(getErrorMessage(error))
    }
  }

  const checkUniqueHost = () => {
    const customHost = getValues('customHost')
    if (customHost) {
      debouncedCheckUniqueHost(customHost)
    }
    else {
      setSlugMessage(null)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      setIsSubmitting(true)
      const { restaurantName, customHost } = form

      if (!user) {
        throw new Error('User not found')
      }

      let validHost = true
      const suggestion = await handleCheckCustomHost({ customHost })

      if (suggestion) {
        validHost = false
        setSlugMessage({
          type: 'error',
          message: `Sorry, '${customHost}' is taken. Please choose another.`,
        })
      }

      if (validHost) {
        await handleCreateRestaurant({
          payload: {
            userId: user.id,
            name: restaurantName || '',
            customHost: slugify(customHost || '', false),
            customDomain: null,
          },
        }, {
          onSuccess() {
            router.replace('/onboarding/2')
          },
          onError(error) {
            throw new Error(getErrorMessage(error))
          },
        })
      }
      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
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
                    <Field.Root
                      id="restaurantName"
                      invalid={!!errors.restaurantName}
                    >
                      <Field.Label>Restaurant Name</Field.Label>
                      <Input
                        {...register('restaurantName', {
                          required: 'This field is required',
                          onBlur: handleSetHost,
                        })}
                        type="text"
                        autoComplete="off"
                      />
                      <Field.ErrorText>
                        {errors.restaurantName?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root id="customHost" invalid={!!errors.customHost}>
                      <Field.Label>Choose a Unique URL</Field.Label>
                      <InputGroup endElement=".getthemenu.com">
                        <Input
                          {...register('customHost', {
                            required: 'This field is required',
                            onChange: checkUniqueHost,
                          })}
                          type="text"
                          autoComplete="off"
                        />
                      </InputGroup>
                      <Field.ErrorText>
                        {errors.customHost?.message}
                      </Field.ErrorText>
                      <Field.HelperText>
                        This URL is where your restaurant will be publicly
                        accessible, it must be unique. You can always change it later.
                      </Field.HelperText>
                      {isChecking && !isSubmitting
                        ? (
                          <Alert.Root status="info" mt="2">
                            <Alert.Indicator>
                              <Spinner size="sm" />
                            </Alert.Indicator>
                            <Alert.Description ml="2">Checking availability...</Alert.Description>
                          </Alert.Root>
                        )
                        : slugMessage
                          ? (
                            <Alert.Root status={slugMessage.type} mt="2">
                              <Alert.Indicator />
                              <Alert.Description ml="2">{slugMessage.message}</Alert.Description>
                            </Alert.Root>
                          )
                          : null}
                    </Field.Root>
                  </GridItem>
                  {/* <GridItem>
                    <Field.Root id="domain" invalid={errors.domain}>
                      <Field.Label>Custom Domain</Field.Label>
                      <Input {...register('domain')} type="url" />
                      <Field.ErrorText>{errors.domain}</Field.ErrorText>
                    </Field.Root>
                  </GridItem> */}
                  <GridItem textAlign="right">
                    <Button
                      type="submit"
                      colorScheme="blue"
                      loadingText="Submitting..."
                      disabled={slugMessage?.type === 'error'}
                      loading={isSubmitting}
                      spinnerPlacement="start"
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
  const supabase = getSupabaseServerClient(context)
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const helpers = await getServerSideHelpers({
    user: data.user,
  })

  const [_, restaurant] = await Promise.all([
    helpers.user.getAuthedUser.prefetch(),
    helpers.restaurant.getOne.fetch({
      where: {
        userId: data.user.id,
      },
    }),
  ])

  if (restaurant?.customHost) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  }
}
