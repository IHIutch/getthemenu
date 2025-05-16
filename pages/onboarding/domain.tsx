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
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash/debounce'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormPayload = z.object({
  customDomain: z.string().max(63),
})

const urlWithoutProtocolSchema = z
  .string()
  .trim()
  .min(1)
  .refine((val) => {
    try {
      const test = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(val.trim())
      if (!test) {
        return false;
      }
      new URL(val, "http://example.com");
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Invalid URL format",
  });

type FormData = z.infer<typeof FormPayload>

const cleanUrl = (url: string) => {
  return url.trim()
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
}

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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormPayload),
  })

  const { mutateAsync: handleCheckCustomDomain, isPending: isChecking } = trpc.verify.checkCustomDomain.useMutation()
  const { mutateAsync: handleUpdateRestaurant, isPending: _isUpdating } = trpc.restaurant.update.useMutation()

  const debouncedCheckUniqueDomain = React.useMemo(
    () => debounce(async (customDomain: string) => {
      try {
        const domain = cleanUrl(customDomain)
        const parsedUrl = urlWithoutProtocolSchema.safeParse(domain)
        if (parsedUrl.error) {
          setSlugMessage({
            type: 'error',
            message: `Invalid URL format. Please enter a valid domain.`,
          })
          return
        }
        const { isAvailable } = await handleCheckCustomDomain({ customDomain: domain })

        setSlugMessage({
          type: isAvailable ? 'success' : 'error',
          message: isAvailable
            ? `Great! '${domain}' is available.`
            : `Sorry, '${domain}' is taken. Please choose another.`,
        })
      }
      catch (error) {
        console.error('Error checking custom domain:', getErrorMessage(error))
        setSlugMessage({
          type: 'error',
          message: `Error checking URL availability. Please try again.`,
        })
      }
    }, 500),
    [handleCheckCustomDomain],
  )

  const checkUniqueDomain = () => {
    const customDomain = getValues('customDomain')
    if (customDomain) {
      debouncedCheckUniqueDomain(customDomain)
    }
    else {
      setSlugMessage(null)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      setIsSubmitting(true)

      if (!user) {
        throw new Error('User not found')
      }

      const domain = cleanUrl(form.customDomain)
      const { isAvailable } = await handleCheckCustomDomain({
        customDomain: domain,
      })

      if (!isAvailable) {
        setSlugMessage({
          type: 'error',
          message: `Sorry, '${domain}' is taken. Please choose another.`,
        })
      }

      if (isAvailable && user?.restaurants?.[0]?.id) {
        await handleUpdateRestaurant({
          where: {
            id: user.restaurants[0].id,
          },
          payload: {
            customDomain: domain,
          },
        }, {
          onSuccess() {
            router.replace('/dashboard')
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
                <Heading as="h1">Add a Custom Domain</Heading>
                <Text color="gray.700">
                  Already have a domain? Add it here to connect your new site.
                </Text>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid gap="6">
                  <GridItem>
                    <Alert.Root status="info" variant="surface">
                      <Alert.Indicator />
                      <Alert.Title>This feature requires an paid subscription.</Alert.Title>
                    </Alert.Root>
                  </GridItem>
                  <GridItem>
                    <Field.Root id="customDomain" invalid={!!errors.customDomain}>
                      <Field.Label>Enter Your Custom Domain</Field.Label>
                      <InputGroup startElement="https://">
                        <Input
                          {...register('customDomain', {
                            required: 'This field is required',
                            onChange: checkUniqueDomain,
                          })}
                          type="text"
                          ps="7ch"
                          autoComplete="off"
                        />
                      </InputGroup>
                      <Field.ErrorText>
                        {errors.customDomain?.message}
                      </Field.ErrorText>
                      <Field.HelperText>
                        If you have a domain ready, enter it here. If you don't have one, you can skip this step.
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
                  <GridItem>
                    <Flex justifyContent="flex-end" gap="4">
                      <Button
                        variant="outline"
                        asChild
                      >
                        <NextLink href="/dashboard">
                          Skip
                        </NextLink>
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        loadingText="Submitting..."
                        disabled={slugMessage?.type === 'error'}
                        loading={isSubmitting}
                        spinnerPlacement="start"
                      >
                        Continue
                      </Button>
                    </Flex>
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

  if (restaurant?.customDomain) {
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
