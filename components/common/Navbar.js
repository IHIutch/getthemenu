import React, { useState } from 'react'
import NextLink from 'next/link'
import { useAuthUser } from '@/utils/react-query/user'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import { postFeedback } from '@/utils/axios/feedback'

export default function Navbar({ children, ...props }) {
  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()
  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const modalState = useDisclosure()

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'idea',
    },
  })

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const data = await postFeedback({
        userId: user.id || '',
        type: form.type || '',
        comment: form.comment || '',
      })
      if (data.error) throw new Error(data.error)
      setIsSubmitting(false)
      modalState.onClose()
    } catch (error) {
      setIsSubmitting(false)
      alert(error)
    }
  }

  return (
    <>
      <Box
        as="nav"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        position="fixed"
        top="0"
        w="100%"
        zIndex="1"
        {...props}
      >
        <Container maxW="container.md">
          <Box>
            <Flex align="center">
              <Flex align="center" h="14">
                <Heading as="h1" fontSize="lg">
                  <NextLink href={'/dashboard'} passHref>
                    <Link>GetTheMenu</Link>
                  </NextLink>
                </Heading>
              </Flex>
              <Box ml="auto">
                <HStack>
                  {restaurant?.customHost && (
                    <NextLink
                      href={`https://${restaurant.customHost}.getthemenu.io`}
                      passHref
                    >
                      <Button size="sm" as={Link} target="blank">
                        View Site
                      </Button>
                    </NextLink>
                  )}
                  <Menu placement="bottom-end">
                    <MenuButton>
                      <Avatar size="sm" name={`${user && user.fullName}`} />
                    </MenuButton>
                    <MenuList boxShadow="lg">
                      <NextLink href="/dashboard" passHref>
                        <MenuItem as={Link}>Dashboard</MenuItem>
                      </NextLink>
                      <NextLink href="/account" passHref>
                        <MenuItem as={Link}>Account Details</MenuItem>
                      </NextLink>
                      <MenuItem as="button" onClick={modalState.onOpen}>
                        Feedback
                      </MenuItem>
                      <NextLink href="/logout" passHref>
                        <MenuItem as={Link}>Log Out</MenuItem>
                      </NextLink>
                    </MenuList>
                  </Menu>
                </HStack>
              </Box>
            </Flex>
            <Box position="relative">{children}</Box>
          </Box>
        </Container>
      </Box>
      <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Have Feedback?</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Box mb="8">
                <Text>
                  If you have any feedback, please let us know. We would love to
                  hear from you.
                </Text>
              </Box>
              <Grid gap="4">
                <GridItem w="100%" d="flex" alignItems="center">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => <FeedbackButtons {...field} />}
                  />
                </GridItem>
                <GridItem w="100%">
                  <FormControl id="comment">
                    <FormLabel>Comment</FormLabel>
                    <Textarea
                      autoComplete="off"
                      {...register('comment', {
                        required: 'This field is required',
                      })}
                      resize="none"
                    />
                    <FormErrorMessage>
                      {errors.comment?.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button onClick={modalState.onClose}>Cancel</Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

const FeedbackButtons = (props) => {
  const options = [
    {
      value: 'idea',
      label: 'Idea',
      icon: '💡',
    },
    {
      value: 'bug',
      label: 'Bug',
      icon: '🪲',
    },
    {
      value: 'other',
      label: 'Other',
      icon: '🤔',
    },
  ]

  const { getRootProps, getRadioProps } = useRadioGroup(props)
  const group = getRootProps()

  return (
    <Box {...group} w="100%">
      <HStack>
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value })
          return (
            <FeedbackButton key={option.value} {...radio}>
              <Box textAlign="center">
                <Text fontSize="3xl">{option.icon}</Text>
                <Text fontWeight="medium">{option.label}</Text>
              </Box>
            </FeedbackButton>
          )
        })}
      </HStack>
    </Box>
  )
}

const FeedbackButton = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" flexGrow="1" maxW="24">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        _checked={{
          bg: 'blue.400',
          color: 'white',
          borderColor: 'blue.400',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px="3"
        py="2"
        width="100%"
        rounded="md"
      >
        {props.children}
      </Box>
    </Box>
  )
}
