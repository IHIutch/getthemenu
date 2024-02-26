import { Box, chakra, Image, Img } from "@chakra-ui/react";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

const MagicImage = chakra<typeof NextImage, NextImageProps>(NextImage, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) => ['alt', 'src', 'blurDataURL', 'onLoad', 'fill'].includes(prop),
})


export default function BlurImage(props: NextImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Box h="full" w="full" position="relative">
      {props.blurDataURL?.startsWith('data') ?
        <>
          <Img
            alt={props.alt}
            src={props.blurDataURL}
            objectFit="cover"
            h="full"
            w="full"
          />
          <Box
            position="absolute"
            h="full"
            w="full"
            backdropFilter="blur(24px)" />
        </>
        : null}
      <MagicImage
        src={props.src}
        fill={true}
        alt={props.alt}
        onLoad={() => {
          setIsLoaded(true)
        }}
        loading="lazy"
        transition="all 0.15s ease"
        position="absolute"
        h="full"
        w="full"
        objectFit="cover"
        sizes={props.sizes}
        sx={isLoaded ? {
          transform: 'scale(1.0)',
          opacity: '1'
        } : {
          transform: 'scale(1.03)',
          opacity: '0'
        }}
      />
    </Box>
  )
}
