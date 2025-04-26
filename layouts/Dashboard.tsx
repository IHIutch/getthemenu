import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import { Box, HStack } from '@chakra-ui/react'
import * as React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar>
        <HStack gap="6">
          <SubnavItem href="/dashboard">Dashboard</SubnavItem>
          <SubnavItem href="/restaurant">Restaurant</SubnavItem>
          <SubnavItem href="/analytics">Analytics</SubnavItem>
        </HStack>
      </Navbar>
      <Box pt="32" pb="8" position="relative">
        {children}
      </Box>
    </>
  )
}
