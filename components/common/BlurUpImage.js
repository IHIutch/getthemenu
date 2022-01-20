import React, { useState } from 'react'
import { Box, Flex, Image, Spinner } from '@chakra-ui/react'
import NextImage from 'next/image'
import { Blurhash } from 'react-blurhash'

export default function BlurUpImage({ src, blurDataURL, alt, priority }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return src ? (
    <>
      <Image
        as={NextImage}
        onLoadingComplete={() => setIsLoaded(true)}
        position="absolute"
        opacity={isLoaded ? 1 : 0}
        loading={priority ? 'eager' : 'lazy'}
        layout="fill"
        boxSize="100%"
        objectFit="cover"
        transition="all 0.2s ease"
        src={src}
        alt={alt}
        priority={priority}
      />
      <Box
        opacity={isLoaded ? 0 : 1}
        transition="all 0.2s ease"
        boxSize="100%"
        position="absolute"
      >
        {blurDataURL ? (
          <Blurhash
            hash={blurDataURL}
            width={priority ? '100%' : 800}
            height={priority ? '100%' : 400}
            resolutionX={56}
            resolutionY={32}
            punch={1}
          />
        ) : (
          <Flex align="center" justify="center">
            <Spinner size="sm" />
          </Flex>
        )}
      </Box>
    </>
  ) : (
    <Box boxSize="100%" bg="gray.200" />
  )
}
