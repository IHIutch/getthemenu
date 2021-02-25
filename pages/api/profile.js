import dayjs from "dayjs";
import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();
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
        const { ops } = await db.collection("menus").insertOne({
          updatedAt: dayjs().toDate(),
          createdAt: dayjs().toDate(),
        });
        res.status(200).json(ops[0]);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
