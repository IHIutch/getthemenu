import NextImage, { ImageProps as NextImageProps } from 'next/image'

export default function BlurImage({ alt, ...props }: NextImageProps) {
  return (
    <NextImage
      alt={alt}
      {...props}
    />
  )
}
