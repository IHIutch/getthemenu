import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
} from '@chakra-ui/layout'
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { useForm, useFormState } from 'react-hook-form'
import { useGetMenu, useUpdateMenu } from '@/utils/react-query/menus'
import slugify from 'slugify'
import { debounce } from 'lodash'
import { Alert, AlertIcon } from '@chakra-ui/alert'
import { Spinner } from '@chakra-ui/spinner'
import { Button, ButtonGroup } from '@chakra-ui/button'
import axios from 'redaxios'

export default function Overview({ query: { menuId } }) {
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugMessage, setSlugMessage] = useState(null)

  const { data: menu } = useGetMenu(menuId)
  const { mutate: handleUpdateMenu, isLoading: isSubmitting } =
    useUpdateMenu(menuId)

  const defaultValues = useMemo(() => {
    return {
      title: menu?.title || '',
      slug: menu?.slug || '',
    }
  }, [menu])

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm()

  const { isDirty } = useFormState({
    control,
  })

  useEffect(() => {
    // Handles resetting the form to the default values after they're loaded in with React Query. Could probably also be handles showing an initial skeleton and swapping when the data is loaded.
    reset(defaultValues)
  }, [defaultValues, reset, menu])

  const handleSetSlug = async () => {
    const [title, slug] = getValues(['title', 'slug'])
    if (title && !slug) {
      const newSlug = slugify(title, {
        lower: true,
        strict: true,
      })
      // const uniqueSlug = await getUniqueSlug(newSlug)
      setValue('slug', newSlug, { shouldValidate: true, shouldDirty: true })
      debouncedCheckUniqueSlug(newSlug)
    }
  }

  // const getUniqueSlug = async (slug) => {
  //   try {
  //     const { data } = await axios.get('/api/menus', {
  //       params: {
  //         similar: slug,
  //         restaurantId: menu?.restaurantId,
  //       },
  //     })
  //     let count = 0
  //     let out = slug
  //     const slugs = data.map((d) => d.slug)
  //     if (slugs) {
  //       while (slugs.includes(out)) {
  //         out = `${slug}-${count + 1}`
  //         count++
  //       }
  //     }
  //     await debouncedCheckUniqueSlug(out)
  //     return out
  //   } catch (error) {
  //     alert(error.message)
  //   }
  // }

  const checkUniqueSlug = useCallback(
    async (slug) => {
      try {
        setIsCheckingSlug(true)
        const testSlug = slugify(slug, {
          lower: true,
          strict: true,
        })
        if (menu?.slug === slug) {
          setSlugMessage(null)
        } else if (testSlug !== slug) {
          setSlugMessage({
            type: 'error',
            message: `Your slug is not valid. Please use only lowercase letters, numbers, and dashes.`,
          })
        } else {
          const { data } = await axios.get('/api/menus', {
            params: {
              slug,
              restaurantId: menu?.restaurantId,
            },
          })
          if (data.length) {
            setSlugMessage({
              type: 'error',
              message: `'${slug}' is already used.`,
            })
          } else {
            setSlugMessage(null)
          }
        }
        setIsCheckingSlug(false)
      } catch (error) {
        alert(error.message)
      }
    },
    [menu?.restaurantId, menu?.slug]
  )

  const handleDebounce = useMemo(
    () => debounce(checkUniqueSlug, 500),
    [checkUniqueSlug]
  )

  const debouncedCheckUniqueSlug = useCallback(
    (slug) => {
      handleDebounce(slug)
    },
    [handleDebounce]
  )

  const watchSlug = watch('slug')
  useEffect(() => {
    if (watchSlug) {
      debouncedCheckUniqueSlug(watchSlug)
    }
  }, [debouncedCheckUniqueSlug, watchSlug])

  const onSubmit = async (form) => {
    try {
      const payload = {
        title: form.title || '',
        slug: slugify(form.slug || '', { lower: true, strict: true }),
      }
      await handleUpdateMenu({
        id: menuId,
        payload,
      })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href={`/menu/${menuId}`}>Overview</SubnavItem>
          <SubnavItem href={`/menu/${menuId}/edit`}>Edit</SubnavItem>
        </HStack>
      </Navbar>
      <Container maxW="container.xl" py="8">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem
            colStart={{ md: '2', xl: '3' }}
            colSpan={{ md: '10', xl: '8' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box bg="white" rounded="md" shadow="base">
                <Box p="6">
                  <Grid w="100%" gap="4">
                    <GridItem>
                      <FormControl id="title">
                        <FormLabel>Menu Title</FormLabel>
                        <Input
                          {...register('title', {
                            required: 'This field is required',
                          })}
                          onBlur={handleSetSlug}
                          type="text"
                          autoComplete="off"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl id="slug">
                        <FormLabel>Menu Slug</FormLabel>
                        <Input
                          {...register('slug', {
                            required: 'This field is required',
                          })}
                          type="text"
                          autoComplete="off"
                        />
                        <FormErrorMessage>
                          {errors.slug?.message}
                        </FormErrorMessage>
                        {isCheckingSlug && (
                          <Alert status="info" mt="2">
                            <Spinner size="sm" />
                            <Text ml="2">Checking availability...</Text>
                          </Alert>
                        )}
                        {!isCheckingSlug && slugMessage && (
                          <Alert size="sm" status={slugMessage.type} mt="2">
                            <AlertIcon />
                            <Text ml="2">{slugMessage.message}</Text>
                          </Alert>
                        )}
                        <FormHelperText>
                          Must be unique to your restaurant.
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                  </Grid>
                </Box>
                <Flex px="6" py="3" borderTopWidth="1px">
                  <ButtonGroup ml="auto">
                    <Button
                      onClick={() => {
                        reset(defaultValues)
                      }}
                      isDisabled={!isDirty}
                    >
                      Reset
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      isDisabled={
                        !isDirty ||
                        isCheckingSlug ||
                        slugMessage?.type === 'error'
                      }
                      isLoading={isSubmitting}
                      loadingText="Saving..."
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </Flex>
              </Box>
            </form>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      query,
    },
  }
}
