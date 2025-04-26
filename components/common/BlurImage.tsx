'use client'

import type { ImageProps as NextImageProps } from 'next/image'

import { Box } from '@chakra-ui/react'

// const MagicImage = chakra<typeof NextImage, NextImageProps>(NextImage, {
//   // ensure that you're forwarding all of the required props for your case
//   shouldForwardProp: prop => ['alt', 'src', 'blurDataURL', 'onLoad', 'fill'].includes(prop),
// })

export default function BlurImage(props: NextImageProps) {
  // const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Box boxSize="full" position="relative">
      {props.blurDataURL?.startsWith('data')
        ? (
            <>
              {/* <Img
                alt={props.alt}
                src={props.blurDataURL}
                objectFit="cover"
                boxSize="full"
                filter="auto"
              /> */}
              <Box
                position="absolute"
                boxSize="full"
                backdropFilter="blur(24px)"
              />
            </>
          )
        : null}
      {/* <MagicImage
        src={props.src}
        alt={props.alt}
        fill={true}
        onLoad={() => {
          setIsLoaded(true)
        }}
        loading="lazy"
        transition="all 0.15s ease"
        position="absolute"
        boxSize="full"
        objectFit="cover"
        sizes={props.sizes}
        sx={isLoaded
          ? {
              transform: 'scale(1.0)',
              opacity: '1',
            }
          : {
              transform: 'scale(1.03)',
              opacity: '0',
            }}
      /> */}
    </Box>
  )
}
