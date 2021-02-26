import connectToDatabase from "@/util/mongoose";
import { Menu, Restaurant } from "models";

export default async (req, res) => {
  await connectToDatabase();
  const { method } = req;

  switch (method) {
    // Update
    case "PUT":
      try {
        const {
          menu: { _id, restaurantId, ...details },
        } = req.body;
        const { value } = await db.collection("menus").findOneAndUpdate(
          { _id: ObjectId(_id) },
          {
            $set: { ...details },
          },
          {
            returnOriginal: false,
          }
        );
        res.status(200).json(value);
      } catch (error) {
        res.status(400).json(error);
      }
      break;

    // Create
    case "POST":
      try {
        const newMenu = await Menu.create({});
        await Restaurant.findByIdAndUpdate("6016ed478483c52d79d9eaec", {
          $push: {
            menus: newMenu._id,
          },
        });
        res.status(200).json(newMenu);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
