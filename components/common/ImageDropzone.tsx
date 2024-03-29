import {
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { X } from 'lucide-react'

export default function ImageDropzone({ onChange, value = '' }: {
  onChange: (val: File | undefined) => void,
  value?: string
}) {
  const [preview, setPreview] = useState(value)
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles[0]) {
      const objectUrl = URL.createObjectURL(acceptedFiles[0])
      onChange(acceptedFiles[0])
      setPreview(objectUrl)
    }

  },
    [onChange]
  )

  const handleClearImage = () => {
    onChange(undefined)
    setPreview('')
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // isDragAccept,
    // isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  })

  return (
    <Flex rounded="md" overflow="hidden">
      {preview ? (
        <Box position="relative" h="100%" w="100%">
          <IconButton
            aria-label='Clear image'
            icon={<Icon boxSize="5" as={X} />}
            size="sm"
            position="absolute"
            top="2"
            right="2"
            onClick={handleClearImage}
          />
          <Image h="100%" w="100%" src={preview} objectFit="cover" alt="" />
        </Box>
      ) : (
        <Flex
          h="100%"
          w="100%"
          bg={isDragActive ? 'blue.100' : 'gray.100'}
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
          <input {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop the files here ...</Text>
          ) : (
            <Text>Upload an Image</Text>
          )}
        </Flex>
      )}
    </Flex>
  )
}
