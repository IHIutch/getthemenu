import React from "react";
import { Box } from "@chakra-ui/react";

const DefaultLayout = ({ children }) => {
  const containerWidths = ["100%", "640px", "768px", "1024px", "1280px"];
  return (
    <Box maxW={[...containerWidths]} mx="auto" px="4">
      {children}
    </Box>
  );
};

export default DefaultLayout;
