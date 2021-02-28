import connectToDatabase from "@/util/mongoose";
import {
  createMenuItem,
  updateMenuItemById,
} from "@/controllers/menuItemController";
import { pushMenuItemToMenu } from "@/controllers/menuController";

export default async (req, res) => {
  await connectToDatabase();
  const { method, body } = req;

  switch (method) {
    // Update
    case "PUT":
      try {
        const { _id, ...rest } = body;
        const menuItem = await updateMenuItemById(_id, rest);
        if (!menuItem) throw Error(`ERROR_UPDATING_MENU_ITEM`);
        res.status(201).json(menuItem);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    // Create
    case "POST":
      try {
        const { menuId, sectionId } = body;
        const menuItem = await createMenuItem({ sectionId });
        const restaurant = await pushMenuItemToMenu(menuId, menuItem._id);
        if (!menuItem || !restaurant) throw Error(`ERROR_CREATING_MENU_ITEM`);
        res.status(201).json(menuItem);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
