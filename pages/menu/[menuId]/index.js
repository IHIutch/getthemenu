import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import { useRouter } from 'next/router'
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
import { useGetMenu } from '@/utils/react-query/menus'
import slugify from 'slugify'
import { debounce } from 'lodash'
import { Alert, AlertIcon } from '@chakra-ui/alert'
import { Spinner } from '@chakra-ui/spinner'
import { Button, ButtonGroup } from '@chakra-ui/button'

export default function Overview() {
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [slugMessage, setSlugMessage] = useState(null)

  const {
    query: { menuId },
  } = useRouter()

  const { data: menu } = useGetMenu(menuId)

  const defaultValues = useMemo(() => {
    return {
      name: menu?.title || '',
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

  const handleSetSlug = async (e) => {
    const [name, slug] = getValues(['name', 'slug'])
    if (name && !slug) {
      // 63 is the max length of a customHost
      const newSlug = slugify(name, {
        lower: true,
        strict: true,
      })
      setValue('slug', newSlug, { shouldValidate: true })
    }
  }

  const handleDebounce = useMemo(
    () =>
      debounce(async (slug) => {
        console.log({ slug })
        setSlugMessage({
          type: 'error',
          message: `'${slug}' is already taken.`,
        })
        setIsCheckingSlug(false)
      }, 500),
    []
  )

  const debouncedCheckUniqueSlug = useCallback(
    (slug) => {
      setIsCheckingSlug(true)
      handleDebounce(slug)
    },
    [handleDebounce]
  )

  const watchSlug = watch('slug')
  useEffect(() => {
    if (watchSlug) {
      debouncedCheckUniqueSlug(watchSlug)
    }
  }, [debouncedCheckUniqueSlug, getValues, watchSlug])

  const onSubmit = async (form) => {
    console.log({ form })
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
                      <FormControl id="name">
                        <FormLabel>Menu Name</FormLabel>
                        <Input
                          {...register('name', {
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
                          {errors.customHost?.message}
                        </FormErrorMessage>
                        <FormHelperText>
                          Must be unique to your restaurant.
                        </FormHelperText>
                        {isCheckingSlug && (
                          <Alert status="info" mt="2">
                            <Spinner />
                            <Text ml="2">Checking availability...</Text>
                          </Alert>
                        )}
                        {!isCheckingSlug && slugMessage && (
                          <Alert size="sm" status={slugMessage.type} mt="2">
                            <AlertIcon />
                            <Text ml="2">{slugMessage.message}</Text>
                          </Alert>
                        )}
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
                      isDisabled={!isDirty}
                      // isLoading={isSubmitting}
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
