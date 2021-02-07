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
    // case "GET":
    //   // Get data from your database
    //   const restaurant = await db.collection("restaurants").findOne({
    //     _id: ObjectId("6016ed478483c52d79d9eaec"),
    //   });
    //   res.json(restaurant);
    //   break;
    case "PUT":
      // Update or create data in your database
      const update = await db.collection("restaurants").updateOne(
        { _id: ObjectId("6016ed478483c52d79d9eaec") },
        { $set: { menu } }
        // { upsert: true }
      );
      res.status(200).json(update);
      break;
    case "POST":
      // console.log(menu);
      const create = await db.collection("restaurants").updateOne(
        { _id: ObjectId("6016ed478483c52d79d9eaec") },
        { $set: { menu } }
        // { upsert: true }
      );
      res.status(200).json(create);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
