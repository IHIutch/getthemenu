import * as React from 'react'
import NextLink from 'next/link'
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
  UseRadioGroupProps,
  UseRadioProps,
} from '@chakra-ui/react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { postFeedback } from '@/utils/axios/feedback'
import { useGetAuthedUser } from '@/utils/react-query/users'

type FormValues = {
  userId: string,
  type: string,
  comment: string,
}

export default function Navbar({
  children,
}: {
  children: React.ReactNode,
}) {

  const { data: user } = useGetAuthedUser()
  const { data: restaurant } = useGetRestaurant(user?.restaurants[0]?.id)

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const modalState = useDisclosure()

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: 'idea',
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const data = await postFeedback({
        userId: user?.id,
        type: form.type,
        comment: form.comment,
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
      >
        <Container maxW="container.md">
          <Box>
            <Flex align="center">
              <Flex align="center" h="14">
                <Heading as="h1" fontSize="lg">
                  <Link as={NextLink} href={'/dashboard'}>GetTheMenu</Link>
                </Heading>
              </Flex>
              <Box ml="auto">
                <HStack>
                  {restaurant?.customHost && (
                    <Button size="sm" as={NextLink} href={`https://${restaurant.customHost}.getthemenu.io`} target="blank">
                      View Site
                    </Button>
                  )}
                  <Menu placement="bottom-end">
                    <MenuButton>
                      <Avatar size="sm" name={`${user && user.fullName}`} />
                    </MenuButton>
                    <MenuList boxShadow="lg">
                      <MenuItem as={NextLink} href="/dashboard">Dashboard</MenuItem>
                      <MenuItem as={NextLink} href="/account">Account Details</MenuItem>
                      <MenuItem as="button" onClick={modalState.onOpen}>Feedback</MenuItem>
                      <MenuItem as={NextLink} href="/logout">Log Out</MenuItem>
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
                <GridItem w="100%" display="flex" alignItems="center">
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

const FeedbackButtons = (props: UseRadioGroupProps) => {
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

const FeedbackButton = ({ children, ...props }: { children: React.ReactNode } & UseRadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const radio = getRadioProps()

  return (
    <Box as="label" flexGrow="1" maxW="24">
      <input {...input} />
      <Box
        {...radio}
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
        {children}
      </Box>
    </Box>
  )
}
