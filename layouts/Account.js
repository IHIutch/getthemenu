import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import { Box, HStack } from '@chakra-ui/react'
import React from 'react'

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href="/account">Account Details</SubnavItem>
          <SubnavItem href="/reset-password">Manage Password</SubnavItem>
        </HStack>
      </Navbar>
      <Box pt="32" pb="8" position="relative">
        {children}
      </Box>
    </>
  )
}
