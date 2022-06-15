import React, { useEffect } from 'react'
import supabase from '@/utils/supabase'
import SEO from '@/components/global/SEO'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Button, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function Homepage() {
  const router = useRouter()
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // TODO: This probably isn't right. Forgot password logs in a user, they can change their password from the settings page
          return router.replace({
            pathname: '/reset-password',
            query: {
              access_token: session.access_token,
            },
          })
        }
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [router])

  return (
    <>
      <Head>
        <SEO
          title="GetTheMenu"
          description="The platform built for both restaurants and their customers"
          image="https://getthemenu.io/meta.png"
          url="https://getthemenu.io"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Text>Homepage</Text>
        <Stack direction="row">
          <NextLink href="/login" passHref>
            <Button as={Link}>Log In</Button>
          </NextLink>
          <NextLink href="/register" passHref>
            <Button as={Link}>Sign Up</Button>
          </NextLink>
        </Stack>
      </Box>
    </>
  )
}
