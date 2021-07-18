import React, { useCallback, useState } from 'react'
import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Textarea,
  Heading,
  Flex,
  Text,
  IconButton,
  Icon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Stack,
  ButtonGroup,
  AspectRatio,
  Image,
  HStack,
} from '@chakra-ui/react'
import Head from 'next/head'
import { MoreVertical, Trash2, Edit } from 'react-feather'
import { useDropzone } from 'react-dropzone'
import SubnavItem from '@/components/common/SubnavItem'
import { useRouter } from 'next/router'

export default function SingleMenu() {
  const drawerState = useDisclosure()
  const [drawerType, setDrawerType] = useState(null)
  const handleDrawerOpen = (content) => {
    setDrawerType(content)
    drawerState.onOpen()
  }

  const { query } = useRouter()
  const { menuId } = query

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
      <Container>
        <Box my="8">
          <Button
            leftIcon={<Icon as={Edit} />}
            colorScheme="blue"
            variant="link"
            onClick={() =>
              handleDrawerOpen(
                <EditTitleDrawer handleDrawerClose={drawerState.onClose} />
              )
            }
          >
            Edit
          </Button>
          <Heading>This is a menu title</Heading>
        </Box>
        <Grid mx="-4">
          {[...Array(3)].map((_, idx) => (
            <GridItem
              key={idx}
              p="4"
              _notFirst={{
                borderTopWidth: '1px',
                borderTopColor: 'gray.200',
              }}
            >
              <Flex alignItems="flex-start">
                <AspectRatio w="16" ratio="1">
                  <Image src="https://picsum.photos/200" objectFit="cover" />
                </AspectRatio>
                <Box ml="4">
                  <Flex>
                    <Box flexGrow="1">
                      <Heading size="md">Single Menu</Heading>
                    </Box>
                    <IconButton
                      size="xs"
                      variant="outline"
                      icon={
                        <Icon
                          boxSize="5"
                          as={MoreVertical}
                          onClick={() =>
                            handleDrawerOpen(
                              <EditItemDrawer
                                handleDrawerClose={drawerState.onClose}
                              />
                            )
                          }
                        />
                      }
                    />
                  </Flex>
                  <Text fontWeight="semibold">$2.99</Text>
                  <Text>This is a single menu. It has a single menu item.</Text>
                </Box>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Container>
      <Drawer
        isOpen={drawerState.isOpen}
        placement="right"
        onClose={drawerState.onClose}
      >
        <DrawerOverlay />
        <DrawerContent>{drawerType}</DrawerContent>
      </Drawer>
    </>
  )
}

const EditTitleDrawer = ({ handleDrawerClose }) => {
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader px="4">Edit Menu Title</DrawerHeader>

      <DrawerBody px="4">
        <Stack spacing="6">
          <FormControl id="menuTitle">
            <FormLabel>Menu Title</FormLabel>
            <Input />
          </FormControl>
        </Stack>
      </DrawerBody>

      <DrawerFooter px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} isFullWidth>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleDrawerClose} isFullWidth>
            Save
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  )
}

const EditItemDrawer = ({ handleDrawerClose }) => {
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader px="4">Edit Item</DrawerHeader>

      <DrawerBody px="4">
        <Stack spacing="6">
          <Box>
            <FormControl id="image">
              <FormLabel>Item Image</FormLabel>
              <AspectRatio ratio={16 / 9} d="block">
                <Dropzone />
              </AspectRatio>
            </FormControl>
          </Box>
          <FormControl id="title">
            <FormLabel>Item Name</FormLabel>
            <Input />
          </FormControl>
          <FormControl id="price">
            <FormLabel>Item Price</FormLabel>
            <Input type="number" />
          </FormControl>
          <FormControl id="desctription">
            <FormLabel>Item Description</FormLabel>
            <Textarea style={{ resize: 'none' }} />
          </FormControl>
          <Box>
            <Button
              colorScheme="red"
              variant="link"
              leftIcon={<Icon as={Trash2} />}
            >
              Delete Item
            </Button>
          </Box>
        </Stack>
      </DrawerBody>

      <DrawerFooter px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} isFullWidth>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleDrawerClose} isFullWidth>
            Save
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  )
}

const Dropzone = ({ handleDrawerClose }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Flex
      bg={isDragActive ? 'blue.100' : 'gray.100'}
      rounded="md"
      borderColor={isDragActive ? 'blue.200' : 'gray.200'}
      borderWidth="1px"
      align="center"
      justify="center"
      textAlign="center"
      fontWeight="semibold"
      transition="all 0.2s ease"
      cursor="pointer"
      {...getRootProps()}
    >
      <Input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the files here ...</Text>
      ) : (
        <Text>Upload an Image</Text>
      )}
    </Flex>
  )
}
