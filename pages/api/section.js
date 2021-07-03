export default async (req, res) => {
  switch (method) {
    case "POST":
      try {
        res.status(201).json(menu);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    // Update
    case "PUT":
      try {
        res.status(201).json(menu);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    // Create
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
