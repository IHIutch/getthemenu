import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Link,
  useDisclosure,
  CloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const navbar = ({ sx }) => {
  const router = useRouter();
  const menu = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    const currentEl = menu.current;
    return () => {
      setMenuHeight(currentEl.clientHeight);
    };
  }, [isOpen]);

  const isPathMatch = (path) => {
    return router.pathname === path;
  };

  const handleToggle = () => {
    return isOpen ? onClose() : onOpen();
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
    <Box as="nav" bg="white" borderBottom="1px" borderColor="gray.200" sx={sx}>
      <Flex wrap="wrap" align="center">
        <Flex align="center" mr="12" h="14">
          <Heading as="h1" size="lg">
            Red Pepper
          </Heading>
        </Flex>

        <CloseButton
          ml="auto"
          d="flex"
          display={{ base: "block", md: "none" }}
          onClick={handleToggle}
        >
          <Box h="6" w="6">
            <svg
              style={{ height: "100%", width: "100%" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </Box>
        </CloseButton>

        <Box
          display={{ base: isOpen ? "block" : "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center"
          flexGrow="1"
          ref={menu}
        >
          {menuItems.map((link, idx) => (
            <Box key={idx}>
              <Link
                d={{ base: "inline-flex", lg: "flex" }}
                key={idx}
                to={link.path}
                sx={
                  isPathMatch(link.path)
                    ? {
                        borderBottom: "2px",
                        borderColor: "black",
                        color: "black",
                      }
                    : { color: "gray.500" }
                }
                fontWeight="semibold"
                color="gray.500"
                _hover={{ color: "gray.700" }}
                py="4"
                px="6"
              >
                {link.name}
              </Link>
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default navbar;
