import { Restaurant } from "models";

const findRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id).exec();
  return restaurant || null;
};

const findRestaurantByIdAndPopulate = async (id) => {
  const restaurant = await Restaurant.findById(id)
    .populate({
      path: "menus",
      options: {
        sort: { createdAt: "asc" },
      },
    })
    .exec();
  return restaurant || null;
};

const findRestaurantBySlug = async (slug) => {
  const restaurant = await Restaurant.findOne({ slug }).exec();
  return restaurant || null;
};

const updateRestaurantById = async (id, data) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }
  );
  return restaurant || null;
};

const createRestaurant = async (data) => {
  const restaurant = await Restaurant.create({ ...data });
  return restaurant || null;
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
  findRestaurantByIdAndPopulate,
  findRestaurantBySlug,
  updateRestaurantById,
  createRestaurant,
  pushMenuToRestaurant,
};
