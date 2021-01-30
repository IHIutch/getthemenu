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
import React from "react";
import DefaultLayout from "../layouts/default";

const menu = () => {
  const restaurant = {
    name: "Red Pepper Chinese And Vietnamese Restaurant",
    phone: "716-831-3878",
    address: {
      street: "3910 Maple Road",
      city: "Amherst",
      state: "NY",
      zip: "14226",
    },
    hours: {},
    menu: [
      {
        name: "Vietnamese Egg Roll",
        price: "3.95",
        description: "",
      },
      {
        name: "Fresh Spring Roll w. Shredded Pork & Veg (2)",
        price: "4.45",
        description:
          "Slow cooked chicken with green curry paste mixed with coconut milk served with white jasmine rice.",
      },
    ],
  };
  return (
    <Box>
      <Head>
        <title>{restaurant.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <AspectRatio ratio={21 / 9} mb="12">
          <Box boxSize="100%">
            <Image boxSize="100%" src="https://picsum.photos/2000/3000/" />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              w="100%"
              p="8"
              bgGradient="linear(transparent 5%, black 100%)"
              color="white"
            >
              <Heading as="h1" textShadow="0 2px 1px black">
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
            </Box>
          </Box>
        </AspectRatio>
        <Box>
          <Box mb="4">
            <Heading as="h2">Menu</Heading>
          </Box>
          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={{ base: "0", lg: "12", xl: "16" }}
            borderTop="1px"
            borderColor="gray.200"
          >
            {restaurant.menu.map((item, idx) => (
              <GridItem
                key={idx}
                borderBottom="1px"
                borderColor="gray.200"
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
        </Box>
      </DefaultLayout>
    </Box>
  );
};

export default menu;
