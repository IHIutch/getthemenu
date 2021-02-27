import { MenuItem } from "models";

const findMenuItemById = async (id) => {
  const menuItem = await MenuItem.findById(id).exec();
  return menuItem || null;
};

const updateMenuItemById = async (id, data) => {
  const menuItem = await MenuItem.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }
  );
  return menuItem || null;
};

const createMenuItem = async (data) => {
  const menuItem = await MenuItem.create({ ...data });
  return menuItem || null;
};

export { findMenuItemById, updateMenuItemById, createMenuItem };
