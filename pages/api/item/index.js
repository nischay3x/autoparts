import connectDB from "../../../lib/mongo.js";
import Items from "../../../models/Items.js";

export default async function handler(req, res) {
  const { method, body, query } = req;
  const { q, limit = 10, skip = 0 } = query;
  await connectDB();

  switch (method) {
    case "POST":
      {
        try {
          await Items.create(body);
          res.status(200).json({ msg: "Created" });
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      }
      break;
    case "GET":
      {
        try {
          let items = [];
          let total = 0;
          if (q) {
            let query = { name: new RegExp(q, "i") };
            items = await Items.find(query).limit(10).skip(skip);
            total = await Items.countDocuments(query);
          } else {
            items = await Items.find().limit(limit).skip(skip);
            total = await Items.countDocuments();
          }
          res.status(200).json({ q, limit, skip, data: items, total });
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      }
      break;
    default:
      break;
  }
}
