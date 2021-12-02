import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { apiGetMenus } from '@/controllers/menus'
import { postMenu } from '@/utils/axios/menus'
import { formatDate } from '@/utils/functions'
import { useGetMenus } from '@/utils/react-query/menus'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { useAuthUser } from '@/utils/react-query/user'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  Container,
  FormErrorMessage,
  Grid,
  GridItem,
  Alert,
  Spinner,
  FormHelperText,
  AlertIcon,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import DefaultLayout from '@/layouts/Default'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import axios from 'redaxios'
import { debounce } from 'lodash'

export default function Profile() {
  const router = useRouter()
  const modalState = useDisclosure()
  const [isCreating, setIsCreating] = useState('')
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
    watch,
    formState: { errors },
  } = useForm()

  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const { data: menus } = useGetMenus(
    restaurant
      ? {
          restaurantId: restaurant.id,
        }
      : null
  )

  const onSubmit = async (form) => {
    try {
      setIsCreating(true)
      const data = await postMenu({
        title: form.title || '',
        slug: form.slug || '',
        restaurantId: user.restaurants[0].id,
      })
      if (data.error) throw new Error(data.error)
      router.replace(`/menu/${data.id}/edit`)
    } catch (error) {
      setIsCreating(false)
      alert(error)
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
        if (testSlug !== slug) {
          setSlugMessage({
            type: 'error',
            message: `Your slug is not valid. Please use only lowercase letters, numbers, and dashes.`,
          })
        } else {
          const { data } = await axios.get('/api/menus', {
            params: {
              slug,
              restaurantId: restaurant?.id,
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
    [restaurant?.id]
  )

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

  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>

      <DefaultLayout>
        <Container maxW="container.xl" py="8">
          <Box>
            <Flex mb="4" align="center">
              <Heading fontSize="xl">Your Menus</Heading>
              <Box ml="auto">
                <Button colorScheme="blue" onClick={modalState.onOpen}>
                  Create a Menu
                </Button>
              </Box>
            </Flex>
            {menus?.length ? (
              <Stack>
                {menus.map((menu, idx) => (
                  <LinkBox key={idx} bg="white" rounded="md" shadow="base">
                    <Box p="3" borderBottomWidth="1px">
                      <NextLink passHref href={`/menu/${menu.id}`}>
                        <LinkOverlay fontWeight="medium" fontSize="2xl">
                          {menu.title}
                        </LinkOverlay>
                      </NextLink>
                    </Box>
                    <Flex p="3" justify="space-between">
                      <Flex align="center">
                        <Circle boxSize="4" bg="green.100">
                          <Circle boxSize="2" bg="green.500" />
                        </Circle>
                        <Text
                          ml="2"
                          lineHeight="1.2"
                          fontWeight="semibold"
                          color="green.600"
                        >
                          Live
                        </Text>
                      </Flex>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Published: {formatDate(menu.createdAt)}
                        </Text>
                      </Box>
                    </Flex>
                  </LinkBox>
                ))}
              </Stack>
            ) : (
              <Center
                borderWidth="2px"
                borderColor="gray.200"
                bg="gray.100"
                py="8"
                rounded="lg"
              >
                <Text fontSize="xl" fontWeight="medium" color="gray.600">
                  Get started by creating your first menu.
                </Text>
              </Center>
            )}
          </Box>
        </Container>
      </DefaultLayout>
      <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Create a New Menu</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid w="100%" gap="4">
                <GridItem>
                  <FormControl id="title" isInvalid={errors.title}>
                    <FormLabel>Menu Title</FormLabel>
                    <Input
                      {...register('title', {
                        required: 'This field is required',
                      })}
                      onBlur={handleSetSlug}
                      type="text"
                      autoComplete="off"
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl id="slug" isInvalid={errors.title}>
                    <FormLabel>Menu Slug</FormLabel>
                    <Input
                      {...register('slug', {
                        required: 'This field is required',
                      })}
                      type="text"
                    />
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
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button onClick={modalState.onClose}>Cancel</Button>
                <Button
                  type="submit"
                  isLoading={isCreating}
                  loadingText="Creating..."
                  colorScheme="blue"
                  isDisabled={slugMessage?.type === 'error'}
                >
                  Create
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

export async function getServerSideProps() {
  const menus = await apiGetMenus()
  return {
    props: {
      // restaurant,
      menus,
    },
  }
}
