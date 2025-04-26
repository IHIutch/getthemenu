import type { SubmitHandler } from 'react-hook-form'

import { getErrorMessage } from '@/utils/functions'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { useGetAuthedUser } from '@/utils/react-query/users'
import { trpc } from '@/utils/trpc/client'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  // useRadio,
  // useRadioGroup,
  Dialog,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Menu,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import * as React from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  userId: string
  type: string
  comment: string
}

export default function Navbar({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user } = useGetAuthedUser()
  const { data: restaurant } = useGetRestaurant(user?.restaurants[0]?.id)
  const { mutateAsync: handleCreateFeedback, isPending: isSubmitting } = trpc.feedback.create.useMutation()

  const modalState = useDisclosure()

  const {
    handleSubmit,
    control: _control,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: 'idea',
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (form) => {
    try {
      await handleCreateFeedback({
        payload: {
          userId: user?.id || '',
          type: form.type,
          comment: form.comment,
        },
      }, {
        onError(error) {
          alert(getErrorMessage(error))
        },
      })
      modalState.onClose()
    }
    catch (error) {
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
                  <Link as={NextLink} href="/dashboard">GetTheMenu</Link>
                </Heading>
              </Flex>
              <Box ml="auto">
                <HStack>
                  {restaurant?.customHost && (
                    <NextLink href={`https://${restaurant.customHost}.getthemenu.io`} passHref target="blank">
                      <Button size="sm">
                        View Site
                      </Button>
                    </NextLink>
                  )}
                  <Menu.Root positioning={{
                    placement: 'bottom-end',
                  }}
                  >
                    <Menu.Trigger>
                      <Avatar.Root size="sm">
                        <Avatar.Fallback name={`${user && user.fullName}`} />
                      </Avatar.Root>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content boxShadow="lg">
                        <NextLink href="/dashboard" passHref>
                          <Menu.Item value="dashboard">Dashboard</Menu.Item>
                        </NextLink>
                        <NextLink href="/account" passHref>
                          <Menu.Item value="details">Account Details</Menu.Item>
                        </NextLink>
                        <Menu.Item value="feedback" onClick={modalState.onOpen}>Feedback</Menu.Item>
                        <NextLink href="/logout" passHref>
                          <Menu.Item value="logout">Log Out</Menu.Item>
                        </NextLink>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </HStack>
              </Box>
            </Flex>
            <Box position="relative">{children}</Box>
          </Box>
        </Container>
      </Box>
      <Dialog.Root open={modalState.open} onOpenChange={e => modalState.setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Header>Have Feedback?</Dialog.Header>
          <Dialog.CloseTrigger />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Body>
              <Box mb="8">
                <Text>
                  If you have any feedback, please let us know. We would love to
                  hear from you.
                </Text>
              </Box>
              <Grid gap="4">
                <GridItem w="100%" display="flex" alignItems="center">
                  {/* <Controller
                    name="type"
                    control={control}
                    render={({ field }) => <FeedbackButtons {...field} />}
                  /> */}
                </GridItem>
                <GridItem w="100%">
                  <Field.Root id="comment">
                    <Field.Label>Comment</Field.Label>
                    <Textarea
                      autoComplete="off"
                      {...register('comment', {
                        required: 'This field is required',
                      })}
                      resize="none"
                    />
                    <Field.ErrorText>
                      {errors.comment?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </GridItem>
              </Grid>
            </Dialog.Body>
            <Dialog.Footer>
              <ButtonGroup>
                <Button onClick={modalState.onClose}>Cancel</Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

// function FeedbackButtons(props: UseRadioGroupProps) {
//   const options = [
//     {
//       value: 'idea',
//       label: 'Idea',
//       icon: '💡',
//     },
//     {
//       value: 'bug',
//       label: 'Bug',
//       icon: '🪲',
//     },
//     {
//       value: 'other',
//       label: 'Other',
//       icon: '🤔',
//     },
//   ]

//   const { getRootProps, getRadioProps } = useRadioGroup(props)
//   const group = getRootProps()

//   return (
//     <Box {...group} w="100%">
//       <HStack>
//         {options.map((option) => {
//           const radio = getRadioProps({ value: option.value })
//           return (
//             <FeedbackButton key={option.value} {...radio}>
//               <Box textAlign="center">
//                 <Text fontSize="3xl">{option.icon}</Text>
//                 <Text fontWeight="medium">{option.label}</Text>
//               </Box>
//             </FeedbackButton>
//           )
//         })}
//       </HStack>
//     </Box>
//   )
// }

// function FeedbackButton({ children, ...props }: { children: React.ReactNode } & UseRadioProps) {
//   const { getInputProps, getRadioProps } = useRadio(props)

//   const input = getInputProps()
//   const radio = getRadioProps()

//   return (
//     <Box as="label" flexGrow="1" maxW="24">
//       <input {...input} />
//       <Box
//         {...radio}
//         cursor="pointer"
//         borderWidth="1px"
//         _checked={{
//           bg: 'blue.400',
//           color: 'white',
//           borderColor: 'blue.400',
//         }}
//         _focus={{
//           boxShadow: 'outline',
//         }}
//         px="3"
//         py="2"
//         width="100%"
//         rounded="md"
//       >
//         {children}
//       </Box>
//     </Box>
//   )
// }
