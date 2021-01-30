import React, { useState } from "react";
import DefaultLayout from "../layouts/default";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Head from "next/head";

const Profile = () => {
  const initMenuItem = { name: "", price: "", description: "" };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const addMenuItem = () => {
    setMenu([...menu].concat({ ...initMenuItem }));
  };

  const updateMenuItem = (idx, key, value) => {
    const updated = [...menu];
    updated[idx] = { ...updated[idx], [key]: value };
    setMenu(updated);
  };

  const removeMenuItem = (idx) => {
    const removed = [...menu];
    removed.splice(idx, 1);
    setMenu(removed);
  };

  const [menu, setMenu] = useState([{ ...initMenuItem }]);

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <Grid templateColumns="repeat(12, 1fr)" gap="6">
          <GridItem colSpan="3">
            <Box>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
            </Box>
          </GridItem>
          <GridItem colSpan="3">
            <Box>
              <FormControl id="phone">
                <FormLabel>Phone</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
            </Box>
          </GridItem>
          <GridItem colSpan="3">
            <Box>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
            </Box>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" gap="6">
          {menu.map((item, idx) => (
            <React.Fragment key={idx}>
              <GridItem colSpan="4">
                <Box>
                  <FormControl id="itemName">
                    <FormLabel>Item Name</FormLabel>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        updateMenuItem(idx, "name", e.target.value)
                      }
                    />
                    {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                  </FormControl>
                </Box>
              </GridItem>
              <GridItem colSpan="4">
                <Box>
                  <FormControl id="itemPrice">
                    <FormLabel>Item Price</FormLabel>
                    <Input
                      value={item.price}
                      onChange={(e) =>
                        updateMenuItem(idx, "price", e.target.value)
                      }
                    />
                    {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                  </FormControl>
                </Box>
              </GridItem>
              <GridItem colSpan="2">
                <Button
                  colorScheme="red"
                  variant="link"
                  onClick={() => removeMenuItem(idx)}
                >
                  Remove
                </Button>
              </GridItem>
              <GridItem colSpan="12">
                <Box>
                  <FormControl id="itemDescription">
                    <FormLabel>Item Description</FormLabel>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateMenuItem(idx, "description", e.target.value)
                      }
                      rows="4"
                    />
                    {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                  </FormControl>
                </Box>
              </GridItem>
            </React.Fragment>
          ))}
        </Grid>
        <Button onClick={addMenuItem}>Add Item</Button>
      </DefaultLayout>
    </>
  );
};

export default Profile;
