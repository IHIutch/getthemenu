import { getErrorMessage, getStructuredData } from "@/utils/functions";
import prisma from "@/utils/prisma";
import { MenuItemSchema, MenuSchema, RestaurantSchema, SectionSchema } from "@/utils/zod";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import Header from "./_components/header";
import Contact from "./_components/contact";
import Content from "./_components/content";
import { Box, Container, Flex, Grid, GridItem, Stack } from "@chakra-ui/react";
import MenuSelector from "./_components/menu-selector";
import Hours from "./_components/hours";

export async function generateMetadata({ params }: { params: { host: string } }): Promise<Metadata | null> {
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
    return null;
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
  }).safeParse(data)

  if (!result.success) {
    return null
  }

  const { name: title, coverImage: image } = result.data

  return {
    title,
    openGraph: {
      title: title || '',
      images: [image?.src || ''],
    },
    twitter: {
      card: "summary_large_image",
      title: title || '',
      images: [image?.src || ''],
    },

  }
}

export default async function HostLayout({
  params,
  children,
}: {
  params: { host: string, slug: string | string[] | undefined };
  children: React.ReactNode;
}) {

  const host = decodeURIComponent(params.host);
  const slug = decodeURIComponent(params.slug?.toString() || '');

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
    sections: z.array(SectionSchema).optional(),
    menuItems: z.array(MenuItemSchema).optional()
  }).safeParse(data)

  if (!result.success) {
    throw Error(getErrorMessage(result.error))
  }

  const ldJson = getStructuredData(result.data)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        suppressHydrationWarning
      />
      <LayoutSkeleton
        header={<Header restaurant={result.data} />}
        menuSelector={<MenuSelector menus={result.data.menus || []} slug={slug} />}
        content={<Content slug={slug}>{children}</Content>}
        contact={<Contact restaurant={result.data} />}
        hours={<Hours restaurant={result.data} />} />
    </>
  );
}

const LayoutSkeleton = ({
  header,
  menuSelector,
  contact,
  hours,
  content
}: {
  header: React.ReactNode,
  menuSelector: React.ReactNode,
  contact: React.ReactNode,
  hours: React.ReactNode,
  content: React.ReactNode,
}) => {
  return (
    <Box position="fixed" boxSize="full" overflow="auto">
      <Flex minHeight="100vh" direction="column" w="full">
        <Box>{header}</Box>
        <Box>{menuSelector}</Box>
        <Box bg="gray.50">
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
      </Flex>
    </Box>
  )
}
