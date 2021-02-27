import connectToDatabase from "@/util/mongoose";
import { Menu, Restaurant } from "models";

const findRestaurantById = async (db, id) => {
  const restaurant = await db.collection("restaurants").findOne({
    _id: id,
  });
  return restaurant || null;
};

const findRestaurantBySlug = async (db, slug) => {
  const restaurant = await db.collection("restaurants").findOne({
    slug,
  });
  return restaurant || null;
};

const updateRestaurantById = async (db, id, update) => {
  const { value } = await db
    .collection("restaurants")
    .findOneAndUpdate({ _id: id }, { $set: update }, { returnOriginal: false });
  return value;
};

const insertRestaurant = async (db, { someData }) => {
  const { ops } = db.collection("restaurants").insertOne({
    someData,
  });
  return ops[0];
};

const pushMenuToRestaurant = async (restaurantId, menuId) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    {
      $push: { menus: menuId },
    },
    { new: true }
  );
  return restaurant;
};

export {
  findRestaurantById,
  findRestaurantBySlug,
  updateRestaurantById,
  insertRestaurant,
  pushMenuToRestaurant,
};
