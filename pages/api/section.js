import connectToDatabase from "@/util/mongoose";
import {
  updateSectionByMenuId,
  pushSectionToMenu,
} from "@/controllers/menuController";

export default async (req, res) => {
  await connectToDatabase();
  const { method, body } = req;

  switch (method) {
    // Update
    case "PUT":
      try {
        const { menuId, ...rest } = body;
        const menu = await updateSectionByMenuId(menuId, rest);
        if (!menu) throw Error(`ERROR_UPDATING_SECTION`);
        res.status(201).json(menu);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    // Create
    case "POST":
      try {
        const { menuId, ...rest } = body;
        const menu = await pushSectionToMenu(menuId, rest);
        if (!menu) throw Error(`ERROR_CREATING_SECTION`);
        res.status(201).json(menu);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
