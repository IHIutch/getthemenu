import React from 'react'
import { Box, HStack } from '@chakra-ui/react'
import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import { useRouter } from 'next/router'

export default function MenuLayout({ children }) {
  const {
    query: { menuId },
  } = useRouter()

  return (
    <>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href={`/menu/${menuId}`}>Overview</SubnavItem>
          <SubnavItem href={`/menu/${menuId}/edit`}>Edit</SubnavItem>
        </HStack>
      </Navbar>
      <Box pt="32" pb="8" position="relative">
        {children}
      </Box>
    </>
  )
}
