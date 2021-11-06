import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import { HStack } from '@chakra-ui/layout'
import React from 'react'

export default function DefaultLayout({ children }) {
  return (
    <>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href="/dashboard">Dashboard</SubnavItem>
          <SubnavItem href="/restaurant">Restaurant</SubnavItem>
          <SubnavItem href="/analytics">Analytics</SubnavItem>
        </HStack>
      </Navbar>
      {children}
    </>
  )
}
