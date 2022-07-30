import React, { useEffect } from 'react'
import supabase from '@/utils/supabase'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Center,
  Circle,
  Container,
  Flex,
  GridItem,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Check } from 'lucide-react'
import { useSEO } from '@/utils/functions'

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

  const features = [
    'Simple menu editing',
    'Easily manage your business details',
    'Built-in analytics',
    'No updates - ever',
    'Premium SEO support',
    'Customer support',
  ]

  const seo = useSEO({
    title: 'GetTheMenu',
    description: 'The platform built for both restaurants and their customers',
    image: 'https://getthemenu.io/meta.png',
    url: 'https://getthemenu.io',
  })

  return (
    <>
      <Head>
        {seo}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex h="full" direction="column">
        <Alert
          status="warning"
          display={{ base: 'block', lg: 'flex' }}
          justifyContent={{ lg: 'center' }}
          flexDirection={{ base: 'column', lg: 'row' }}
        >
          <AlertTitle>Under Construction:</AlertTitle>
          <AlertDescription>
            Pardon our dust, we&apos;re finishing up our marketing campaign to
            bring you an exciting new homepage. Coming soon!
          </AlertDescription>
        </Alert>
        <Container maxW="container.lg">
          <Box textAlign="right" mt="2">
            <Text>
              Already have an account?{' '}
              <NextLink href="/login" passHref>
                <Link
                  color="blue.500"
                  fontWeight="semibold"
                  textDecoration="underline"
                >
                  Log In
                </Link>
              </NextLink>
            </Text>
          </Box>
          <Box textAlign="center" my="12">
            <Heading as="h1" mb="2" fontSize="5xl" fontWeight="semibold">
              GetTheMenu
            </Heading>
            <Text fontSize="2xl" color="gray.600">
              Our goal is simple: Get your menu in front of customers as fast as
              possible.
            </Text>
          </Box>
          <Box textAlign="center">
            <Heading
              as="h2"
              fontWeight="semibold"
              color="blue.500"
              textTransform="uppercase"
              fontSize="xl"
            >
              Get Started Today
            </Heading>
            <Text color="gray.600" mt="2">
              1 month{' '}
              <Text as="span" fontWeight="semibold">
                FREE
              </Text>{' '}
              trial, no credit card required!
            </Text>
            <Text
              mt="6"
              fontWeight="semibold"
              textTransform="uppercase"
              fontSize="lg"
            >
              Then
            </Text>
            <Flex direction="column" align="center" mt="-4">
              <Flex align="flex-start">
                <Text fontSize="3xl" fontWeight="bold" mt="3">
                  $
                </Text>
                <Text fontSize="6xl" fontWeight="medium">
                  20
                </Text>
              </Flex>
              <Text mt="-4">per month</Text>
            </Flex>
          </Box>
          <Box mt="8" textAlign="center">
            <NextLink href="/register" passHref>
              <Button as={Link} colorScheme="blue" size="lg" mb="4">
                Create Your First Menu
              </Button>
            </NextLink>
            <Text fontSize="xl">
              Create your first menu and be online in minutes!
            </Text>
          </Box>
        </Container>
        <Box mt="24" bg="gray.200" py="12">
          <Container maxW="container.lg" textAlign="center">
            <Stack
              direction={{ base: 'row', lg: 'row' }}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Need some inspiration?
              </Text>
              <Button
                as={Link}
                colorScheme="blue"
                href="https://whereslloyd.getthemenu.io?ref=example"
                isExternal
              >
                Check Out an Example
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container maxW="container.lg" mt="24">
          <Heading
            as="h2"
            fontWeight="semibold"
            color="blue.500"
            textTransform="uppercase"
            fontSize="xl"
            textAlign="center"
            mb="4"
          >
            What You Get
          </Heading>
          <Flex justify="center">
            <SimpleGrid columns={{ base: '1', md: '2' }} spacing="4">
              {features.map((feature, idx) => (
                <GridItem
                  key={idx}
                  as={Stack}
                  direction="row"
                  alignItems="center"
                >
                  <Circle bg="green.50" boxSize="6" p="1">
                    <Icon color="green.600" as={Check} boxSize="full" />
                  </Circle>
                  <Text>{feature}</Text>
                </GridItem>
              ))}
            </SimpleGrid>
          </Flex>
        </Container>
        <Box mt="auto" w="full">
          <Center mt="12" py="4" bg="gray.200">
            <Stack direction="row" spacing="6">
              <NextLink href="/terms-of-use" passHref>
                <Link fontWeight="medium" textDecor="underline">
                  Terms of Use
                </Link>
              </NextLink>
              <NextLink href="/privacy-policy" passHref>
                <Link fontWeight="medium" textDecor="underline">
                  Privacy Policy
                </Link>
              </NextLink>
            </Stack>
          </Center>
        </Box>
      </Flex>
    </>
  )
}
