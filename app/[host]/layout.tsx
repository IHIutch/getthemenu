import { getErrorMessage } from "@/utils/functions";
import prisma from "@/utils/prisma";
import { MenuSchema, RestaurantSchema } from "@/utils/zod";
import { notFound } from "next/navigation";
import { z } from "zod";
import Header from "./_components/header";
import Contact from "./_components/contact";
import Content from "./_components/content";
import { Box, Container, Flex, Grid, GridItem, Link, Stack, Text } from "@chakra-ui/react";
import MenuSelector from "./_components/menu-selector";
import Hours from "./_components/hours";
import NextLink from "next/link"



export default async function HostLayout({
  params,
  children,
}: {
  params: { host: string, slug: string | string[] | undefined };
  children: React.ReactNode;
}) {

  const host = decodeURIComponent(params.host);

  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host
    },
    include: {
      menuItems: {
        orderBy: {
          position: 'asc'
        }
      },
      menus: {
        orderBy: {
          position: 'asc'
        }
      },
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  })

  if (!data) {
    notFound()
  }

  const result = RestaurantSchema.pick({
    name: true,
    hours: true,
    address: true,
    phone: true,
    email: true,
    coverImage: true,
    customHost: true,
    customDomain: true,
  }).extend({
    menus: z.array(MenuSchema).optional(),
  }).safeParse(data)

  if (!result.success) {
    throw Error(getErrorMessage(result.error))
  }

  return (
    <LayoutSkeleton
      header={<Header restaurant={result.data} />}
      menuSelector={<MenuSelector menus={result.data.menus || []} />}
      content={<Content>{children}</Content>}
      contact={<Contact restaurant={result.data} />}
      hours={<Hours restaurant={result.data} />}
      footer={<Footer host={host} />}
    />
  );
}

const Footer = ({ host }: { host: string }) => {
  return (
    <Box as="footer" borderTopWidth="1px" py="6" mt="auto">
      <Text textAlign="center" fontWeight="medium" color="gray.600">
        Powered by{' '}
        <Link as={NextLink} href={`https://getthemenu.io?ref=${host}`} color="blue.500" target="_blank">
          GetTheMenu
        </Link>
      </Text>
    </Box>
  )
}

const LayoutSkeleton = ({
  header,
  menuSelector,
  contact,
  hours,
  content,
  footer
}: {
  header: React.ReactNode,
  menuSelector: React.ReactNode,
  contact: React.ReactNode,
  hours: React.ReactNode,
  content: React.ReactNode,
  footer: React.ReactNode,
}) => {
  return (
    <Box position="fixed" boxSize="full" overflow="auto" bg="gray.50">
      <Flex minHeight="100vh" direction="column" w="full">
        {header}
        {menuSelector}
        <Box >
          <Container maxW="container.lg">
            <Grid templateColumns="repeat(12, 1fr)" gap="4" pb="8">
              <GridItem
                colSpan={{ base: 12, lg: 7 }}
                position="relative"
              >
                {content}
              </GridItem>
              <GridItem
                display={{ base: 'none', lg: 'block' }}
                colSpan={{ base: 12, lg: 4 }}
                colStart={{ lg: 9 }}
              >
                <Box position="sticky" top="28">
                  <Stack pt="4" spacing="8">
                    <Box>{contact}</Box>
                    <Box>{hours}</Box>
                  </Stack>
                </Box>
              </GridItem>
            </Grid>
          </Container>
        </Box>
        {footer}
      </Flex>
    </Box>
  )
}
