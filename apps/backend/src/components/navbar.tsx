import {
  Avatar,
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Flex,
  Heading,
  HStack,
  Menu,
  useDisclosure,

} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import * as React from 'react'

// interface FormValues {
//   userId: string
//   type: string
//   comment: string
// }

export default function Navbar({
  restaurant,
  user,
}: {
  restaurant: {
    customHost: string
    publicId: string
  }
  user: {
    fullName: string
  }
}) {
  // const { data: user } = trpc.user.getAuthedUser.useQuery(undefined, {
  //   refetchOnMount: false,
  // })

  // const { data: restaurant } = trpc.restaurant.getById.useQuery({
  //   where: {
  //     publicId: restPublicId?.toString() || '',
  //   },
  // }, {
  //   refetchOnMount: false,
  // })

  // const { mutateAsync: handleCreateFeedback, isPending: isSubmitting } = trpc.feedback.create.useMutation()

  const modalState = useDisclosure()

  // const {
  //   handleSubmit,
  //   control: _control,
  //   register,
  //   formState: { errors },
  // } = useForm<FormValues>({
  //   defaultValues: {
  //     type: 'idea',
  //   },
  // })

  // const onSubmit: SubmitHandler<FormValues> = async (form) => {
  //   try {
  //     await handleCreateFeedback({
  //       payload: {
  //         type: form.type,
  //         comment: form.comment,
  //       },
  //     }, {
  //       onError(error) {
  //         toaster.create({
  //           title: 'Error',
  //           description: getErrorMessage(error),
  //           type: 'error',
  //         })
  //       },
  //     })
  //     modalState.onClose()
  //   }
  //   catch (error) {
  //     toaster.create({
  //       title: 'Error',
  //       description: getErrorMessage(error),
  //       type: 'error',
  //     })
  //   }
  // }

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
                  <Link
                    to="/$publicId/dashboard"
                    params={{
                      publicId: restaurant.publicId,
                    }}
                  >
                    GetTheMenu
                  </Link>
                </Heading>
              </Flex>
              <Box ml="auto">
                <HStack>
                  {restaurant?.customHost && (
                    <Button size="sm" asChild>
                      <ChakraLink href={`https://${restaurant.customHost}.getthemenu.io`} target="blank">
                        View Site
                      </ChakraLink>
                    </Button>
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
                        <Menu.Item value="dashboard" asChild>
                          <Link
                            to="/$publicId/dashboard"
                            params={{ publicId: restaurant.publicId }}
                          >
                            Dashboard
                          </Link>
                        </Menu.Item>
                        <Menu.Item value="details" asChild>
                          <Link to="/account">Account Details</Link>
                        </Menu.Item>
                        <Menu.Item value="feedback" onClick={modalState.onOpen}>Feedback</Menu.Item>
                        <Menu.Item value="logout" asChild>
                          <Link to="/logout">Log Out</Link>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </HStack>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Box>
      {/* <Dialog.Root open={modalState.open} onOpenChange={e => modalState.setOpen(e.open)}>
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
                <GridItem w="100%" display="flex" alignItems="center"> */}
      {/* <Controller
                    name="type"
                    control={control}
                    render={({ field }) => <FeedbackButtons {...field} />}
                  /> */}
      {/* </GridItem>
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
      </Dialog.Root> */}
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
