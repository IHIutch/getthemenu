import axios from "redaxios";
import React, { useEffect, useState } from "react";
import Container from "../components/common/container";
import Navbar from "../components/common/navbar";
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
  Heading,
  Flex,
  VisuallyHidden,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberInputStepper,
  NumberIncrementStepper,
  Text,
  Checkbox,
  HStack,
  Menu,
  MenuList,
  MenuButton,
  IconButton,
  MenuItem,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import Head from "next/head";
import ContentEditable from "react-contenteditable";
import { MoreVertical, Trash2 } from "react-feather";

const Profile = ({ restaurant }) => {
  const initMenuItem = { name: "", price: "", description: "" };
  const initMenuSection = { name: "", items: [{ ...initMenuItem }] };
  const [menu, setMenu] = useState(restaurant.menu);
  const [sections, setSections] = useState([{}]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState([]);

  const addMenuSection = () => {
    const added = { ...menu };
    (added.sections = { ...menu }.sections.concat({ ...initMenuSection })),
      setMenu(added);
  };

  const addMenuItem = (idx) => {
    const added = { ...menu };
    added.sections[idx].items = { ...menu }.sections[idx].items.concat({
      ...initMenuItem,
    });
    setMenu(added);
    handleAddEditing(added.length - 1);
  };

  const updateMenuItem = (idx, sectionIdx, key, value) => {
    const updated = { ...menu };
    updated.sections[sectionIdx].items[idx][key] = value;
    setMenu(updated);
  };

  const updateMenuSection = (idx, key, value) => {
    const updated = { ...menu };
    updated.sections[idx][key] = value;
    setMenu(updated);
  };

  const removeMenuItem = (idx, sectionIdx) => {
    const removed = { ...menu };
    removed.sections[sectionIdx].items.splice(idx, 1);
    setMenu(removed);
  };

  const removeMenuSection = (idx) => {
    const removed = { ...menu };
    removed.sections.splice(idx, 1);
    setMenu(removed);
  };

  const handleAddEditing = (idx) => {
    const added = [...editing].concat(idx);
    setEditing(added);
  };

  const handleRemoveEditing = (idx) => {
    const removed = [...editing];
    removed.splice(removed.indexOf(idx), 1);
    setEditing(removed);
  };

  const saveMenu = () => {
    // console.log(menu);
    axios.put(`${process.env.BASE_URL}/api/profile`, { menu });
  };

  useEffect(() => {
    editing.length
      ? (window.onbeforeunload = function () {
          return true;
        })
      : (window.onbeforeunload = null);
  }, [editing]);

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Navbar />
        <Box py="12">
          <Heading
            fontSize="md"
            fontWeight="semibold"
            textTransform="uppercase"
            color="gray.500"
            letterSpacing="0.025rem"
          >
            Menu
          </Heading>
          <Flex mb="8">
            <Heading as="h1" size="2xl">
              {restaurant.menu.name}
            </Heading>
            {/* <Button colorScheme="blue" onClick={() => saveMenu()} ml="auto">
              Save Menu
            </Button> */}
          </Flex>
          <Grid templateColumns="repeat(12, 1fr)" gap="6">
            <GridItem colSpan={{ base: "12", lg: "8" }}>
              <VStack
                // divider={<StackDivider borderColor="gray.200" />}
                spacing="24"
                align="stretch"
              >
                {menu &&
                  menu.sections.map((section, sectionIdx) => (
                    <Box key={sectionIdx}>
                      <Heading
                        mb="4"
                        fontSize="md"
                        fontWeight="semibold"
                        textTransform="uppercase"
                        color="gray.500"
                        letterSpacing="0.025rem"
                      >
                        Section
                      </Heading>
                      <MenuSection
                        updateMenuSection={updateMenuSection}
                        removeMenuSection={removeMenuSection}
                        details={section}
                        idx={sectionIdx}
                        key={sectionIdx}
                      >
                        <Box>
                          <Heading
                            mb="4"
                            fontSize="md"
                            fontWeight="semibold"
                            textTransform="uppercase"
                            color="gray.500"
                            letterSpacing="0.025rem"
                          >
                            Items
                          </Heading>
                          <VStack
                            divider={<StackDivider borderColor="gray.200" />}
                            spacing="6"
                            align="stretch"
                          >
                            {section.items.map((item, itemIdx) => (
                              <SectionItem
                                key={itemIdx}
                                idx={itemIdx}
                                sectionIdx={sectionIdx}
                                item={item}
                                updateMenuItem={updateMenuItem}
                                removeMenuItem={removeMenuItem}
                                editing={editing}
                                handleAddEditing={handleAddEditing}
                                handleRemoveEditing={handleRemoveEditing}
                              />
                            ))}
                            <Box>
                              <Button onClick={() => addMenuItem(sectionIdx)}>
                                Add Item
                              </Button>
                            </Box>
                          </VStack>
                        </Box>
                      </MenuSection>
                    </Box>
                  ))}
              </VStack>
              <Box mt="16" pt="4" borderTop="1px" borderColor="gray.200">
                <Button w="100%" onClick={addMenuSection}>
                  Add Section
                </Button>
              </Box>
            </GridItem>
            {/* <GridItem colSpan="4">
              <Box bg="gray.50" p="8">
                <Heading as="h1" fontSize="xl" mb="4">
                  Restaurant Details
                </Heading>
                <Box>
                  <FormControl id="name">
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="phone">
                    <FormLabel>Phone</FormLabel>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </Box>
            </GridItem> */}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

const MenuSection = ({
  idx,
  details,
  children,
  updateMenuSection,
  removeMenuSection,
}) => {
  return (
    <Box>
      <Flex pb="4" mb="2">
        <Box flexGrow="1">
          <FormControl id="sectionName">
            <FormLabel as={VisuallyHidden}>Section Name</FormLabel>
            <Input
              as={ContentEditable}
              html={details.name || "Untitled Section"}
              size="lg"
              w="auto"
              d="inline-flex"
              alignItems="center"
              fontSize="2xl"
              fontWeight="semibold"
              // value={item.name}
              onChange={(e) => updateMenuSection(idx, "name", e.target.value)}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </Box>
        <Box flexShrink="0" ml="8" d="none">
          <Box as="fieldset">
            <FormLabel as="legend">Availability</FormLabel>
            <Flex alignItems="center">
              <FormControl id="availabilityStart">
                <FormLabel as={VisuallyHidden}>Availability Start</FormLabel>
                <NumberInput max={23} min={0} w="20">
                  <NumberInputField textAlign="right" />
                </NumberInput>
                <FormHelperText mt="1">Hours</FormHelperText>
              </FormControl>
              <Text as="span" px="2" mb="6">
                :
              </Text>
              <FormControl id="availabilityEnd">
                <FormLabel as={VisuallyHidden}>Availability End</FormLabel>
                <NumberInput step={15} max={45} min={0} w="20">
                  <NumberInputField textAlign="right" />
                </NumberInput>
                <FormHelperText mt="1">Minutes</FormHelperText>
              </FormControl>
            </Flex>
          </Box>
        </Box>
      </Flex>
      {children}
    </Box>
  );
};

const SectionItem = ({
  item,
  idx,
  sectionIdx,
  updateMenuItem,
  removeMenuItem,
  editing,
  handleAddEditing,
  handleRemoveEditing,
}) => {
  const saveMenuItem = () => {
    console.log("saved");
    handleRemoveEditing(idx);
  };

  const formatPrice = (val) => `$` + val;
  const parsePrice = (val) => parseFloat(val).toFixed(2).replace(/^\$/, "");

  return editing.includes(idx) ? (
    // Editing
    <Grid mb="12" templateColumns="auto min-content" gap="6">
      <GridItem>
        <Flex flexGrow="1">
          <FormControl id="itemName">
            <FormLabel>Item Name</FormLabel>
            <Input
              value={item.name}
              onChange={(e) =>
                updateMenuItem(idx, sectionIdx, "name", e.target.value)
              }
            />
          </FormControl>
          <FormControl id="itemPrice" ml="4">
            <FormLabel>Item Price</FormLabel>
            <NumberInput
              onChange={(valueString) =>
                updateMenuItem(
                  idx,
                  sectionIdx,
                  "price",
                  parsePrice(valueString)
                )
              }
              value={formatPrice(item.price)}
              step={0.01}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Flex>
      </GridItem>
      <GridItem alignSelf="" justifySelf="end">
        <Flex>
          <Button colorScheme="green" onClick={saveMenuItem}>
            Save
          </Button>
          <Menu placement="bottom-end">
            <MenuButton
              size="xs"
              variant="outline"
              as={IconButton}
              icon={<MoreVertical />}
              ml="2"
            />
            <MenuList>
              <MenuItem
                color="red.600"
                fontWeight="semibold"
                icon={<Trash2 />}
                _hover={{ bg: "red.50" }}
                _focus={{ bg: "red.50" }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
      <GridItem colSpan="1">
        <Box>
          <FormControl id="itemDescription">
            <FormLabel>Item Description</FormLabel>
            <Textarea
              value={item.description}
              onChange={(e) =>
                updateMenuItem(idx, sectionIdx, "description", e.target.value)
              }
              rows="4"
            />
          </FormControl>
        </Box>
      </GridItem>
      <GridItem colStart="1">
        <Flex>
          <Box>
            <FormControl as="fieldset">
              <FormLabel as="legend">Dietary Restrictions</FormLabel>
              <HStack spacing="24px">
                <Checkbox>Gluten Free</Checkbox>
                <Checkbox>Diary Free</Checkbox>
                <Checkbox>Vegan</Checkbox>
                <Checkbox>Vegetarian</Checkbox>
              </HStack>
            </FormControl>
          </Box>
        </Flex>
      </GridItem>
      <GridItem>
        <Box as="fieldset">
          <FormLabel as="legend">Availability</FormLabel>
          <Flex alignItems="center">
            <FormControl id="availabilityStart">
              <FormLabel as={VisuallyHidden}>Availability Start</FormLabel>
              <NumberInput max={23} min={0} w="20">
                <NumberInputField textAlign="right" />
              </NumberInput>
              <FormHelperText mt="1">Hours (24)</FormHelperText>
            </FormControl>
            <Text as="span" px="2" mb="6">
              :
            </Text>
            <FormControl id="availabilityEnd">
              <FormLabel as={VisuallyHidden}>Availability End</FormLabel>
              <NumberInput step={15} max={45} min={0} w="20">
                <NumberInputField textAlign="right" />
              </NumberInput>
              <FormHelperText mt="1">Minutes</FormHelperText>
            </FormControl>
          </Flex>
        </Box>
      </GridItem>
    </Grid>
  ) : (
    // Not Editing
    <Grid templateColumns="auto min-content" gap={{ base: "4", lg: "6" }}>
      <GridItem>
        <Box>
          <Flex fontWeight="semibold" fontSize="lg">
            <Box flexGrow="1">
              <Text
                as="span"
                fontStyle={item.name ? "" : "italic"}
                color={item.name ? "gray.700" : "gray.500"}
              >
                {item.name || "Untitled Item"}
              </Text>
            </Box>
            <Box flexShrink="1" ml="4">
              <Text
                as="span"
                fontStyle={item.price ? "" : "italic"}
                color={item.price ? "gray.700" : "gray.500"}
              >
                ${item.price || "0.00"}
              </Text>
            </Box>
          </Flex>
          <Box mt="2">
            <Text
              fontStyle={item.description ? "" : "italic"}
              color={item.description ? "gray.700" : "gray.500"}
            >
              {item.description || "No description..."}
            </Text>
          </Box>
        </Box>
      </GridItem>
      <GridItem>
        <Flex>
          <Button
            d={{ base: "none", lg: "inline-block" }}
            mr="2"
            colorScheme="blue"
            variant="outline"
            onClick={() => handleAddEditing(idx)}
          >
            Edit
          </Button>
          <Menu placement="bottom-end" size="sm">
            <MenuButton
              as={IconButton}
              size="sm"
              variant="outline"
              icon={<MoreVertical />}
            />
            <MenuList>
              <MenuItem
                fontWeight="semibold"
                icon={<Trash2 />}
                onClick={() => handleAddEditing(idx)}
              >
                Edit
              </MenuItem>
              <MenuItem
                color="red.600"
                fontWeight="semibold"
                icon={<Trash2 />}
                _hover={{ bg: "red.50" }}
                _focus={{ bg: "red.50" }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export async function getServerSideProps(context) {
  const restaurant = await axios
    .get(`${process.env.BASE_URL}/api/profile`)
    .then((res) => res.data);

  if (!restaurant) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      restaurant,
    },
  };
}

export default Profile;
