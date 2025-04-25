import { Link, useToken } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

export default function SubnavItem({ href, children }: { href: string, children: React.ReactNode }) {
  const { asPath } = useRouter()
  const [blue500] = useToken('colors', ['blue.500'])

  return (
    <Link
      as={NextLink}
      href={href}
      fontWeight="semibold"
      py="2"
      boxShadow={asPath === href ? `inset 0 -3px ${blue500}` : ''}
      color={asPath === href ? 'blue.500' : ''}
    >
      {children}
    </Link>
  )
}
