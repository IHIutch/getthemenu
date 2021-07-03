import React from "react";
import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Image,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import Container from "../components/common/Container";

import { handleStructuredData } from "@/util/functions";


export default function SingleRestaurant({ restaurant, menus }) {
  const structuredData = useMemo(() => {
    return handleStructuredData({restaurant, menus})
  }, [restaurant, menus])


  return (
    <Box>
      <Head>
        <title>{restaurant.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData()),
          }}
        />
      </Head>
      <AspectRatio ratio={{ base: 16 / 9, lg: 21 / 9 }} mb="12">
        <Box boxSize="100%">
          <Image
            boxSize="100%"
            objectFit="cover"
            src="https://picsum.photos/2000/3000/"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            w="100%"
            py="6"
            bgGradient="linear(transparent 5%, black 100%)"
            color="white"
          >
            <Container>
              <Heading as="h1" textShadow="0 2px 1px black" mb="1">
                {restaurant.name}
              </Heading>
              <Flex>
                <Box>
                  <Text as="span">
                    <Text as="span" fontWeight="semibold" mr="2">
                      Phone:
                    </Text>
                    {restaurant.phone}
                  </Text>
                </Box>
                <Box ml="6">
                  <Text as="span">
                    <Text as="span" fontWeight="semibold" mr="2">
                      Address:
                    </Text>
                    {restaurant.address.street} {restaurant.address.city},{" "}
                    {restaurant.address.state} {restaurant.address.zip}
                  </Text>
                </Box>
              </Flex>
            </Container>
          </Box>
        </Box>
      </AspectRatio>
      <Box>
        <Container>
          <Heading as="h2" fontSize="3xl">
            {menus[0].name}
          </Heading>
        </Container>
        {menus[0] &&
          menus[0].sections.map((section, idx) => (
            <Box key={idx} py="8" bg={idx % 2 ? "gray.50" : "white"}>
              <Container>
                <Heading as="h2" fontSize="2xl">
                  {section.name}
                </Heading>
              </Container>
              <Container
                sx={{
                  mt: 4,
                }}
              >
                <Grid
                  templateColumns="repeat(12, 1fr)"
                  gap={{ base: "0", lg: "12", xl: "16" }}
                >
                  {menus[0] &&
                    menus[0].menuItems
                      .filter((i) => i.sectionId === section._id)
                      .map((item, idx) => (
                        <GridItem
                          key={idx}
                          py="2"
                          colSpan={{ base: "12", lg: "6", xl: "4" }}
                        >
                          <Box>
                            <Flex fontWeight="semibold" fontSize="lg">
                              <Box flexGrow="1">
                                <Text as="span">{item.name}</Text>
                              </Box>
                              <Box flexShrink="1" ml="4">
                                <Text as="span">${item.price}</Text>
                              </Box>
                            </Flex>
                            {item.description && (
                              <Box mt="2">
                                <Text color="gray.700">{item.description}</Text>
                              </Box>
                            )}
                          </Box>
                        </GridItem>
                      ))}
                </Grid>
              </Container>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context) {
  // const { restaurant, menus } = 
  // return {
  //   props: {
  //     restaurant,
  //     menus,
  //   },
  // };
}

export default menu;
