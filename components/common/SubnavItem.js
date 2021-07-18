import React from 'react'
import NextLink from 'next/link'
import { Link, useToken } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function SubnavItem({ href, children }) {
  const isPathMatch = (path) => {
    return asPath === path
  }

  const { asPath } = useRouter()
  const [blue500] = useToken('colors', ['blue.500'])

  return (
    <NextLink href={href} passHref>
      <Link
        fontWeight="semibold"
        py="2"
        boxShadow={isPathMatch(href) && `inset 0 -3px ${blue500}`}
        color={isPathMatch(href) && 'blue.500'}
      >
        {children}
      </Link>
    </NextLink>
  )
}
