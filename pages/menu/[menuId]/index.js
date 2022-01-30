import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { useGetMenu, useUpdateMenu } from '@/utils/react-query/menus'
import slugify from 'slugify'
import { debounce } from 'lodash'
import axios from 'redaxios'
import MenuLayout from '@/layouts/Menu'
import router, { useRouter } from 'next/router'
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useAuthUser } from '@/utils/react-query/user'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { deleteMenu } from '@/utils/axios/menus'

export default function MenuOverview() {
  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Container maxW="container.md">
        <Stack spacing="6">
          <Box bg="white" rounded="md" shadow="base">
            <DetailsSection />
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <DeleteSection />
          </Box>
        </Stack>
      </Container>
    </>
  )
}

const DetailsSection = () => {
  const {
    query: { menuId },
  } = useRouter()

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )
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
            setSlugMessage({
              type: 'success',
              message: `'${slug}' is available.`,
            })
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
              <InputGroup>
                {(restaurant?.customHost || restaurant?.customDomain) && (
                  <InputLeftAddon>
                    {restaurant?.customHost
                      ? `${restaurant.customHost}.getthemenu.io/`
                      : `${restaurant.customDomain}/`}
                  </InputLeftAddon>
                )}
                <Input
                  {...register('slug', {
                    required: 'This field is required',
                  })}
                  type="text"
                  autoComplete="off"
                />
              </InputGroup>
              <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
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
              !isDirty || isCheckingSlug || slugMessage?.type === 'error'
            }
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            Save
          </Button>
        </ButtonGroup>
      </Flex>
    </form>
  )
}

const DeleteSection = () => {
  const router = useRouter()
  const { menuId } = router.query

  const dialogState = useDisclosure()
  const leastDestructiveRef = useRef()

  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = async (form) => {
    try {
      setIsDeleting(true)
      const data = await deleteMenu(menuId)
      if (data.error) throw new Error(data.error)
      router.replace('/dashboard')
    } catch (error) {
      setIsDeleting(false)
      alert(error)
    }
  }

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading as="h2" fontSize="xl" fontWeight="semibold">
          Danger Zone
        </Heading>
      </Box>
      <Box p="6">
        <Box
          bg="red.100"
          rounded="md"
          borderColor="red.200"
          borderWidth="1px"
          p="4"
        >
          <Heading as="h3" fontSize="lg" mb="1" fontWeight="semibold">
            Delete Menu
          </Heading>
          <Text mb="4">
            Your menu will no longer be visible to your visitors and will
            permanently delete all of it&apos;s contents. Please be careful
            before proceeding.
          </Text>
          <Button colorScheme="red" onClick={dialogState.onOpen}>
            Delete
          </Button>
        </Box>
      </Box>
      <AlertDialog
        isOpen={dialogState.isOpen}
        onClose={dialogState.onClose}
        leastDestructiveRef={leastDestructiveRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Menu
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb="4">Are you sure you want to delete this menu?</Text>
              <Text>This action is permanent and cannot be undone.</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup>
                <Button ref={leastDestructiveRef} onClick={dialogState.onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={onDelete}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

MenuOverview.getLayout = (page) => <MenuLayout>{page}</MenuLayout>
