import React, { useEffect } from 'react'
import supabase from '@/utils/supabase'
import SEO from '@/components/global/SEO'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
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
import { Check, CheckCircle } from 'lucide-react'

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
    '210+ Components',
    'Unlimited projects',
    'Unlimited users',
    'Lifetime access',
    'Customer support',
    'Free updates',
  ]

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
      <Container h="full" maxW="container.lg">
        <Flex h="full" direction="column">
          <Box py="12">
            <Flex>
              <Box mb="12">
                <Heading as="h1" mb="2" fontSize="5xl" fontWeight="semibold">
                  GetTheMenu
                </Heading>
                <Text fontSize="2xl" color="gray.600">
                  The platform built for both restaurants and their customers
                </Text>
              </Box>
              <Box ml="auto">
                <NextLink href="/login" passHref>
                  <Button as={Link}>Log In</Button>
                </NextLink>
              </Box>
            </Flex>
            <Grid templateColumns="repeat(12, 1fr)" gap="8">
              <GridItem colSpan={{ base: '12', lg: '6' }}></GridItem>
              <GridItem colSpan={{ base: '12', lg: '6' }}>
                <Box bg="white" rounded="lg" shadow="base" w="full">
                  <Flex p="6" align="center" borderBottomWidth="1px">
                    <Box>
                      <Heading
                        as="h2"
                        fontSize="2xl"
                        fontWeight="semibold"
                        mb="1"
                      >
                        Monthly Subscription
                      </Heading>
                      <Text color="gray.600">
                        1 month{' '}
                        <Text as="span" fontWeight="semibold">
                          FREE
                        </Text>{' '}
                        trial, no credit card required!
                      </Text>
                    </Box>
                    <Box ml="auto" pl="6">
                      <Flex align="flex-end">
                        <Flex align="flex-start">
                          <Text fontSize="3xl" fontWeight="bold" mt="3">
                            $
                          </Text>
                          <Text fontSize="6xl" fontWeight="medium">
                            20
                          </Text>
                        </Flex>
                        <Text mb="5" whiteSpace="nowrap">
                          / month
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box p="6" borderBottomWidth="1px">
                    <Box mb="8">
                      <Heading
                        as="h3"
                        fontSize="lg"
                        fontWeight="semibold"
                        mb="1"
                      >
                        What&apos;s Included?
                      </Heading>
                      <Text color="gray.600">
                        All you need to build your restuarant website!
                      </Text>
                    </Box>
                    <SimpleGrid columns={2} spacing="4">
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
                  </Box>
                  <Box p="6">
                    <NextLink href="/register" passHref>
                      <Button
                        as={Link}
                        colorScheme="blue"
                        size="lg"
                        isFullWidth
                      >
                        Sign Up Today!
                      </Button>
                    </NextLink>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </Box>
          <Center mt="auto" w="full" py="4">
            <Stack direction="row" spacing="6">
              <NextLink href="/terms-of-use" passHref>
                <Link>Terms of Use</Link>
              </NextLink>
              <NextLink href="/privacy-policy" passHref>
                <Link>Privacy Policy</Link>
              </NextLink>
            </Stack>
          </Center>
        </Flex>
      </Container>
    </>
  )
}
