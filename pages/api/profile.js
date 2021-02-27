import connectToDatabase from "@/util/mongoose";
import { updateMenuById, createMenu } from "@/controllers/menuController";
import { pushMenuToRestaurant } from "@/controllers/restaurantController";

export default async (req, res) => {
  await connectToDatabase();
  const { method, body } = req;

  switch (method) {
    // Update
    case "PUT":
      try {
        const { _id, ...rest } = body;
        const menu = await updateMenuById(_id, rest);
        if (!menu) throw Error(`ERROR_UPDATING_MENU`);
        res.status(201).json(menu);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    // Create
    case "POST":
      try {
        const menu = await createMenu({});
        const restaurant = await pushMenuToRestaurant(
          "6016ed478483c52d79d9eaec",
          menu._id
        );
        if (!menu || !restaurant) throw Error(`ERROR_CREATING_MENU`);
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
