import React, { useState, useCallback } from "react";
import connectToDatabase from "@/util/mongoose";

import axios from "redaxios";
import debounce from "lodash/debounce";
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
  Menu,
  MenuList,
  MenuButton,
  IconButton,
  MenuItem,
  VStack,
  StackDivider,
  Icon,
  Collapse,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import Head from "next/head";
import ContentEditable from "react-contenteditable";
import { MoreVertical, Trash2, ChevronDown, Edit } from "react-feather";
import { findRestaurantByIdAndPopulate } from "@/controllers/restaurantController";

const Profile = ({ restaurant, menus }) => {
  const initMenuItem = { name: "", price: "", description: "" };
  const initMenuSection = { name: "", items: [{ ...initMenuItem }] };
  const [editingMenus, setEditingMenus] = useState(menus);
  const [activeMenu, setActiveMenu] = useState(0);

  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  // const [email, setEmail] = useState("");

  const saveMenu = () => {
    axios.put(`${process.env.NEXT_PUBLIC_VERCEL_URL}api/profile`, { menu });
  };

  const createMenu = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}api/menu`,
        {
          restaurantId: restaurant._id,
        }
      );
      setEditingMenus([...editingMenus].concat(data));
    } catch (error) {
      console.error(error);
    }
  };

  const createMenuItem = async (sectionId) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}api/menuItem`,
        {
          menuId: editingMenus[activeMenu]._id,
          sectionId,
        }
      );
      const created = [...editingMenus];
      created[activeMenu].menuItems.concat(data);
      setEditingMenus(created);
    } catch (error) {
      console.error(error);
    }
  };

  const debounceSaveMenu = useCallback(
    debounce(() => {
      saveMenu();
    }, 500),
    []
  );

  const createSection = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}api/section`,
        {
          menuId: editingMenus[activeMenu]._id,
        }
      );
      const created = [...editingMenus];
      created[activeMenu] = data;
      setEditingMenus(created);
    } catch (error) {
      console.error(error);
    }
  };

  const updateMenuItem = (idx, sectionIdx, obj) => {
    const updated = { ...menu };
    updated.sections[sectionIdx].items[idx] = obj;
    setMenu(updated);
    saveMenu();
  };

  const updateMenuSection = (idx, key, value) => {
    const updated = { ...menu };
    updated.sections[idx][key] = value;
    setMenu(updated);
    debounceSaveMenu(updated);
  };

  const removeMenuItem = (idx, sectionIdx) => {
    const removed = { ...menu };
    removed.sections[sectionIdx].items.splice(idx, 1);
    setMenu(removed);
    saveMenu();
  };

  const removeMenuSection = (idx) => {
    const removed = { ...menu };
    removed.sections.splice(idx, 1);
    setMenu(removed);
    saveMenu();
  };

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar handleCreateMenu={createMenu} menus={editingMenus} />
      <Container>
        <Box py="12">
          <Heading
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
            color="gray.500"
            letterSpacing="0.025rem"
          >
            Menu
          </Heading>
          <Flex mb="8">
            <Heading as="h1" size="2xl">
              {editingMenus[activeMenu] && editingMenus[activeMenu].name}
            </Heading>
          </Flex>
          <Grid templateColumns="repeat(12, 1fr)" gap="6">
            <GridItem colSpan={{ base: "12", lg: "8" }}>
              <VStack spacing="24" align="stretch">
                {editingMenus[activeMenu] &&
                  editingMenus[activeMenu].sections.map(
                    (section, sectionIdx) => (
                      <Box key={sectionIdx}>
                        <Heading
                          mb="2"
                          fontSize="sm"
                          fontWeight="bold"
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
                              fontSize="sm"
                              fontWeight="bold"
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
                              {editingMenus[activeMenu].menuItems
                                .filter((i) => {
                                  return i.sectionId === section._id;
                                })
                                .map((item, itemIdx) => (
                                  <SectionItem
                                    key={itemIdx}
                                    idx={itemIdx}
                                    sectionIdx={sectionIdx}
                                    item={item}
                                    updateMenuItem={updateMenuItem}
                                    removeMenuItem={removeMenuItem}
                                  />
                                ))}
                              <Box>
                                <Button
                                  onClick={() => createMenuItem(section._id)}
                                >
                                  Add Item
                                </Button>
                              </Box>
                            </VStack>
                          </Box>
                        </MenuSection>
                      </Box>
                    )
                  )}
              </VStack>
              <Box mt="16" pt="4" borderTop="1px" borderColor="gray.200">
                <Button w="100%" onClick={createSection}>
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
      <Flex pb="4" mb="4">
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
}) => {
  const {
    isOpen: isAdvancedOpen,
    onOpen: onAdvancedOpen,
    onClose: onAdvancedClose,
  } = useDisclosure();
  const {
    isOpen: isEditingOpen,
    onOpen: onEditingOpen,
    onClose: onEditingClose,
  } = useDisclosure();
  const [localItem, setLocalItem] = useState(item);

  const saveMenuItem = () => {
    updateMenuItem(idx, sectionIdx, localItem);
    onEditingClose();
    onAdvancedClose();
  };

  const cancelMenuItem = () => {
    setLocalItem(item);
    onEditingClose();
    onAdvancedClose();
  };

  const updateLocalItem = (key, value) => {
    setLocalItem({
      ...localItem,
      [key]: value,
    });
  };

  const formatPrice = (val) => `$` + val;
  const parsePrice = (val) => parseFloat(val).toFixed(2).replace(/^\$/, "");

  const handleToggle = () => {
    isAdvancedOpen ? onAdvancedClose() : onAdvancedOpen();
  };

  return isEditingOpen ? (
    // Editing
    <Grid
      mb="12"
      templateColumns="repeat(12, 1fr)"
      gap="4"
      p="4"
      bg="gray.50"
      border="1px"
      borderColor="gray.200"
      rounded="md"
    >
      <GridItem colSpan="12">
        <Flex alignItems="center" mb="2">
          <Heading fontSize="lg" fontWeight="bold" color="gray.600">
            Editing Item
          </Heading>
          <Menu placement="bottom-end">
            <MenuButton
              size="sm"
              variant="outline"
              as={IconButton}
              icon={<Icon as={MoreVertical} h="5" w="5" />}
              ml="auto"
            />
            <MenuList>
              <MenuItem
                color="red.600"
                fontWeight="semibold"
                icon={<Trash2 />}
                _hover={{ bg: "red.50" }}
                _focus={{ bg: "red.50" }}
                onClick={() => removeMenuItem(idx, sectionIdx)}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
      <GridItem colSpan="8">
        <FormControl id="itemName">
          <FormLabel>Name</FormLabel>
          <Input
            value={localItem.name}
            onChange={(e) => updateLocalItem("name", e.target.value)}
          />
        </FormControl>
      </GridItem>
      <GridItem colSpan="4">
        <FormControl id="itemPrice">
          <FormLabel>Price</FormLabel>
          <NumberInput
            onChange={(valueString) =>
              updateLocalItem("price", parsePrice(valueString))
            }
            value={formatPrice(localItem.price)}
            step={0.01}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </GridItem>
      <GridItem colSpan="12">
        <Box>
          <FormControl id="itemDescription">
            <FormLabel>Description</FormLabel>
            <Textarea
              value={localItem.description}
              onChange={(e) => updateLocalItem("description", e.target.value)}
              rows="4"
            />
          </FormControl>
        </Box>
      </GridItem>
      <GridItem colSpan="12">
        <Flex alignItems="center">
          <Box>
            <Button
              rightIcon={
                <Icon
                  transition="transform 0.2s ease"
                  transform={
                    isAdvancedOpen ? "rotateZ(180deg)" : "rotateZ(0deg)"
                  }
                  as={ChevronDown}
                />
              }
              colorScheme="green"
              variant="link"
              onClick={handleToggle}
            >
              Advanced
            </Button>
          </Box>
          <Box ml="auto">
            <Button variant="outline" onClick={cancelMenuItem}>
              Cancel
            </Button>
            <Button ml="2" colorScheme="green" onClick={saveMenuItem}>
              Save
            </Button>
          </Box>
        </Flex>
        <Box>
          <Collapse in={isAdvancedOpen}>
            <Box mt="4">
              <FormControl as="fieldset">
                <FormLabel as="legend">Dietary Restrictions</FormLabel>
                <Flex flexWrap="wrap">
                  <Checkbox p="2">Gluten Free</Checkbox>
                  <Checkbox p="2">Diary Free</Checkbox>
                  <Checkbox p="2">Vegan</Checkbox>
                  <Checkbox p="2">Vegetarian</Checkbox>
                </Flex>
              </FormControl>
            </Box>
          </Collapse>
        </Box>
      </GridItem>
      {/* <GridItem>
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
      </GridItem> */}
    </Grid>
  ) : (
    // Not Editing
    <HStack spacing={{ base: "4", lg: "6" }} alignItems="flex-start">
      <Box mt="1" flexGrow="1">
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
      <Flex>
        <Button
          d={{ base: "none", lg: "inline-block" }}
          mr="2"
          colorScheme="blue"
          variant="outline"
          onClick={onEditingOpen}
        >
          Edit
        </Button>
        <Menu placement="bottom-end" size="sm">
          <MenuButton
            as={IconButton}
            size="sm"
            variant="outline"
            icon={<Icon as={MoreVertical} h="5" w="5" />}
          />
          <MenuList>
            <MenuItem
              fontWeight="semibold"
              icon={<Edit />}
              onClick={onEditingOpen}
            >
              Edit
            </MenuItem>
            <MenuItem
              color="red.600"
              fontWeight="semibold"
              icon={<Trash2 />}
              _hover={{ bg: "red.50" }}
              _focus={{ bg: "red.50" }}
              onClick={() => removeMenuItem(idx, sectionIdx)}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  );
};

export async function getServerSideProps() {
  await connectToDatabase();
  const data = await findRestaurantByIdAndPopulate("6016ed478483c52d79d9eaec");
  const { menus, ...restaurant } = JSON.parse(JSON.stringify(data));

  return {
    props: {
      restaurant,
      menus,
    },
  };
}

export default Profile;
