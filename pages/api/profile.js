import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();
  const {
    // query: { id, name },
    method,
  } = req;

  const { menu } = req.body;

  switch (method) {
    // Update
    case "PUT":
      const { _id, ...details } = menu;
      const update = await db
        .collection("menus")
        .replaceOne({ _id: ObjectId(_id) }, { ...details });
      res.status(200).json(update);
      break;

    // Create
    case "POST":
      const create = await db
        .collection("restaurants")
        .updateOne(
          { _id: ObjectId("6016ed478483c52d79d9eaec") },
          { $set: { menu } }
        );
      res.status(200).json(create);
      break;
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
