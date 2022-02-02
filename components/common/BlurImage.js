import { useState } from 'react'
import NextImage from 'next/image'
import { Image } from '@chakra-ui/react'

export default function BlurImage(props) {
  const [isLoading, setLoading] = useState(true)

  return (
    <Image
      as={NextImage}
      {...props}
      alt={props?.alt || ''}
      transition="all 0.3s ease"
      sx={
        isLoading
          ? {
              transform: 'scale(1.05)',
            }
          : {
              transform: 'scale(1)',
            }
      }
      onLoadingComplete={() => setLoading(false)}
    />
  )
}
