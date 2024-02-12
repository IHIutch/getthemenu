import * as React from 'react'
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
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Check, ExternalLink } from 'lucide-react'
import { useSEO } from '@/utils/functions'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Homepage() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      // TODO: This probably isn't right. Forgot password logs in a user, they can change their password from the settings page
      return router.replace({
        pathname: '/reset-password',
        query: {
          access_token: session?.access_token,
        },
      })
    }
  })

  authListener.subscription.unsubscribe()

  const features = [
    'Simple menu editing',
    'Easily manage your business details',
    'Built-in analytics',
    'No updates - ever',
    'Premium SEO support',
    'Personal customer support',
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
          flexShrink="0"
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
        <Container maxW="container.lg" mt="4">
          <Flex mt="2" align="center" justify="flex-end">
            <Text mr="2" fontWeight="medium">
              Have an account?
            </Text>
            <Button as={NextLink} href="/login" colorScheme="blue" variant="outline">
              Log In
            </Button>
          </Flex>
          <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6" mt="20">
            <GridItem colSpan={{ md: '7' }}>
              <Flex h="full" align="center">
                <Box>
                  <Text
                    textTransform="uppercase"
                    letterSpacing="wide"
                    fontWeight="semibold"
                    color="gray.500"
                  >
                    Early Access
                  </Text>
                  <Heading as="h1" fontSize="7xl" fontWeight="black">
                    Get the Menu
                  </Heading>
                  <Text fontSize="3xl" color="gray.600" lineHeight="1.3">
                    The platform built for getting your menu into customers
                    hands{' '}
                    <Text as="span" fontWeight="semibold" fontStyle="italic">
                      as fast as possible
                    </Text>
                    .
                  </Text>
                </Box>
              </Flex>
            </GridItem>
            <GridItem colSpan={{ md: '5' }}>
              <Box bg="white" shadow="md" rounded="lg" w="full" p="8">
                <Box textAlign="center">
                  <Box>
                    <Heading
                      as="h2"
                      fontWeight="bold"
                      letterSpacing="wider"
                      color="blue.500"
                      textTransform="uppercase"
                      fontSize="2xl"
                    >
                      Start Today
                    </Heading>
                    <Text fontSize="lg" color="gray.500" fontWeight="medium">
                      And be online in minutes!
                    </Text>
                  </Box>

                  <Flex direction="column" align="center" mt="4">
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
                  <Box textAlign="center" mt="8">
                    <Text color="gray.600">
                      1 month{' '}
                      <Text as="span" fontWeight="semibold">
                        FREE
                      </Text>{' '}
                      trial, no credit card required!
                    </Text>
                  </Box>
                  <Button as={NextLink} href="/register" colorScheme="blue" mt="4" isFullWidth>
                    Create Your First Menu
                  </Button>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>
        <Box mt="24" bg="gray.100" py="10">
          <Container maxW="container.lg" textAlign="center">
            <Heading as="h2" fontSize="4xl" fontWeight="black">
              Not sure where to get started?
            </Heading>
            <Text fontSize="xl" color="gray.600">
              We&apos;ve got you covered!
            </Text>
            <Button
              mt="8"
              as={Link}
              size="lg"
              colorScheme="blue"
              href="https://whereslloyd.getthemenu.io?ref=example"
              isExternal
            >
              Check Out an Example
              <Icon ml="2" as={ExternalLink} />
            </Button>
          </Container>
        </Box>
        <Container maxW="container.lg" mt="24">
          <Heading
            as="h2"
            fontWeight="semibold"
            color="blue.500"
            textTransform="uppercase"
            fontSize="lg"
            textAlign="center"
            letterSpacing="wide"
          >
            What You Get
          </Heading>
          <Heading
            as="h3"
            fontSize="4xl"
            fontWeight="black"
            textAlign="center"
            mt="2"
          >
            Make managing your website a breeze
          </Heading>
          <Flex justify="center" mt="12">
            <SimpleGrid columns={{ base: '1', md: '2' }} spacing="4">
              {features.map((feature, idx) => (
                <GridItem
                  key={idx}
                  as={Stack}
                  direction="row"
                  alignItems="center"
                >
                  <Circle bg="blue.500" boxSize="6" p="1">
                    <Icon color="white" as={Check} boxSize="full" />
                  </Circle>
                  <Text fontSize="lg">{feature}</Text>
                </GridItem>
              ))}
            </SimpleGrid>
          </Flex>
        </Container>
        <Box mt="auto" w="full">
          <Center mt="12" py="4" bg="gray.200">
            <Stack direction="row" spacing="6">
              <Link as={NextLink} href="/terms-of-use" fontWeight="medium" textDecor="underline">
                Terms of Use
              </Link>
              <Link as={NextLink} href="/privacy-policy" fontWeight="medium" textDecor="underline">
                Privacy Policy
              </Link>
            </Stack>
          </Center>
        </Box>
      </Flex>
    </>
  )
}
