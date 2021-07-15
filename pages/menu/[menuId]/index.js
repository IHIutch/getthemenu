import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

export default function Overview() {
  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Navbar />
      <Box>Menu Overview</Box>
      <Container></Container>
    </>
  )
}
