import React from "react";
import supabase from "../util/supabase";
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
import Container from "../components/common/container";

const menu = ({ restaurant, menus }) => {
  const structuredData = () => {
    return {
      "@context": "http://schema.org",
      "@type": "Restaurant",
      url: "http://www.thisisarestaurant.com",
      name: restaurant.name,
      image: restaurant.image,
      telephone: restaurant.phone,
      priceRange: "$100 - $200",
      description: "a description of this business",
      address: {
        "@type": "PostalAddress",
        streetAddress: restaurant.address.streetAddress,
        addressLocality: restaurant.address.city,
        addressRegion: restaurant.address.state,
        postalCode: restaurant.address.zip,
      },
      servesCuisine: ["American cuisine"],
      hasMenu: menus.map((menu) => ({
        "@type": "Menu",
        name: menu.name,
        // description: "Menu for in-restaurant dining only.",
        hasMenuSection: menu.sections.map((section) => ({
          "@type": "MenuSection",
          name: section.name,
          // description: "Appetizers and such",
          // image: "https://thisisarestaurant.com/starter_dishes.jpg",
          // offers: {
          //   "@type": "Offer",
          //   availabilityEnds: "T8:22:00",
          //   availabilityStarts: "T8:22:00",
          // },
          hasMenuItem: section.items.map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.description,
            offers: {
              "@type": "Offer",
              price: item.price,
              priceCurrency: "USD",
            },
            // suitableForDiet: "http://schema.org/GlutenFreeDiet",
          })),
        })),
      })),
    };
  };
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
        {menus[0].sections.map((section, idx) => (
          <Box key={idx} py="8" bg={idx % 2 ? "gray.50" : "white"}>
            {/* <Box position="sticky" top="0" bg="inherit"> */}
            <Container>
              <Heading
                as="h2"
                fontSize="2xl"
                // py="3"
                // borderBottom="1px"
                // borderColor="gray.200"
              >
                {section.name}
              </Heading>
            </Container>
            {/* </Box> */}
            <Container
              sx={{
                mt: 4,
                // pb: restaurant.menu.sections - 1 === idx ? "0" : "16",
              }}
            >
              <Grid
                templateColumns="repeat(12, 1fr)"
                gap={{ base: "0", lg: "12", xl: "16" }}
              >
                {section.items.map((item, idx) => (
                  <GridItem
                    key={idx}
                    // borderBottom="1px"
                    // borderColor="gray.200"
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
  const { data, error } = await supabase
    .from("restaurants")
    .select(`*, menus(*)`)
    .eq("id", "1aaf08dd-e5db-4f33-925d-6553998fdddd");

  const { menus, ...restaurant } = data[0];

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      restaurant: { id: restaurant.id, ...restaurant.details },
      menus: menus.map((menu) => {
        return {
          id: menu.id,
          ...menu.details,
        };
      }),
    },
  };
}

export default menu;
