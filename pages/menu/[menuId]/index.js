import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'
import { Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React from 'react'

export default function Overview() {
  const { query } = useRouter()
  const { menuId } = query

  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href={`/menu/${menuId}`}>Overview</SubnavItem>
          <SubnavItem href={`/menu/${menuId}/edit`}>Edit</SubnavItem>
        </HStack>
      </Navbar>
      <Box>Menu Overview</Box>
      <Container></Container>
    </>
  )
}
