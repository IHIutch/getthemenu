import React from "react";
import {
  Box,
  Flex,
  Heading,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Icon,
  Stack,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Menu } from "react-feather";
import Container from "../common/container";

const navbar = ({ sx }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isPathMatch = (path) => {
    return router.pathname === path;
  };

  const menuItems = [
    {
      name: "Menus",
      path: "/profile",
    },
    {
      name: "Settings",
      path: "/settings",
    },
  ];

  return (
    <>
      <Box
        as="nav"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        sx={sx}
      >
        <Container>
          <Flex wrap="wrap" align="center">
            <Flex align="center" h="14">
              <Heading as="h1" size="lg">
                Red Pepper
              </Heading>
            </Flex>
            <Button onClick={onOpen} px="2" ml="auto">
              <Icon as={Menu} h="6" w="6" />
            </Button>
          </Flex>
        </Container>
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody px="6" py="5">
              <Stack as="ul">
                {menuItems &&
                  menuItems.map((item, idx) => (
                    <Box
                      as="li"
                      d="flex"
                      alignItems="center"
                      lineHeight="1.5rem"
                      key={idx}
                    >
                      <NextLink href={item.path} passHref>
                        <Link
                          fontWeight="semibold"
                          color="blue.500"
                          py="1"
                          w="100%"
                        >
                          {item.name}
                        </Link>
                      </NextLink>
                    </Box>
                  ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default navbar;
