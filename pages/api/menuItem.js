export default async (req, res) => {
  const { method, body } = req;

  switch (method) {
    // Create
    case "POST":
      try {
        res.status(201).json(menuItem);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    // Update
    case "PUT":
      try {
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
