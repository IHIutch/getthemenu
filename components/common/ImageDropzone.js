import {
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X } from 'lucide-react'

export default function ImageDropzone({ onChange, value = '' }) {
  const [preview, setPreview] = useState(value)
  const [file, setFile] = useState(null)
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(acceptedFiles[0])
    },
    [setFile]
  )

  useEffect(() => {
    if (file) {
      onChange(file)
    }
    const objectUrl = file ? URL.createObjectURL(file) : null
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, onChange])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // isDragAccept,
    // isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'image/*',
  })

  const previewSrc = useMemo(() => {
    return preview || value
  }, [preview, value])

  return (
    <Flex rounded="md" overflow="hidden">
      {previewSrc ? (
        <Box position="relative" h="100%" w="100%">
          <IconButton
            icon={<Icon boxSize="5" as={X} />}
            size="sm"
            position="absolute"
            top="2"
            right="2"
            onClick={() => onChange(null)}
          />
          <Image h="100%" w="100%" src={previewSrc} objectFit="cover" />
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
          <Input {...getInputProps()} />
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
