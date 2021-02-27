import { Menu } from "models";

const findMenuById = async (id) => {
  const menu = await Menu.findById(id).exec();
  return menu || null;
};

const findMenuBySlug = async (slug) => {
  const menu = await Menu.findOne({ slug }).exec();
  return menu || null;
};

const updateMenuById = async (id, data) => {
  const menu = await Menu.findByIdAndUpdate(id, { ...data }, { new: true });
  return menu || null;
};

const createMenu = async (data) => {
  const menu = await Menu.create({ ...data });
  return menu || null;
};

export { findMenuById, findMenuBySlug, updateMenuById, createMenu };
