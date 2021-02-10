import dayjs from "dayjs";
import supabase from "../../util/supabase";

export default async (req, res) => {
  const {
    // query: { id, name },
    method,
  } = req;

  const { menu } = req.body;
  const { id, ...details } = menu;

  switch (method) {
    // Update
    case "PUT":
      try {
        const { data, error } = await supabase
          .from("menus")
          .update({
            details: details,
            updatedAt: dayjs(),
          })
          .eq("id", id);
        if (error) {
          throw new Error(error);
        }
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json(error);
      }
      break;

    // Create
    case "POST":
      try {
        const { data, error } = await supabase
          .from("menus")
          .update({
            details: details,
            updatedAt: dayjs(),
          })
          .eq("id", id);
        if (error) {
          throw new Error(error);
        }
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
