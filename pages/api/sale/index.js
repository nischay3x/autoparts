import connectDB from "../../../lib/mongo.js";
import Sales from "../../../models/Sales.js";
import Items from "../../../models/Items.js";

export default async function handler(req, res) {
  const { method, body, query } = req;
  await connectDB();

  switch (method) {
    case "POST":
      {
        try {
          const { items } = body;
          const salesCount = await Sales.countDocuments();
          const newSaleId = "" + (salesCount + 1);
          await Sales.create({
            _id: newSaleId,
            ...body,
            paid: body.type === "CASH",
          });
          await refreshStock(items);
          res.status(200).json({ id: newSaleId });
        } catch (error) {
          console.log(error);
          res.status(500).send(error);
        }
      }
      break;
    case "GET":
      {
        try {
          let searchQuery = {};
          let data = null;
          if (query.id) {
            data = await Sales.findById(query.id);
            return res.status(200).json({ data: [data] });
          }

          if (query.contact) {
            searchQuery["contact"] = query.contact;
          }
          if (query.type) {
            searchQuery["type"] = query.type;
          }
          if (query.paid) {
            searchQuery["paid"] = query.paid === "true";
          }
          if (query.from) {
            searchQuery["updatedAt"] = { $gte: new Date(query.from) };
          }
          if (query.to) {
            searchQuery["updatedAt"] = { $lte: new Date(query.to) };
          }
          if (query.from && query.to) {
            searchQuery["updatedAt"] = {
              $gte: new Date(query.from),
              $lte: new Date(query.to),
            };
          }

          data = await Sales.find(searchQuery)
            .sort({ updatedAt: 1 })
            .limit(query.limit || 5)
            .skip(query.skip || 0);
          const totalDocs = await Sales.countDocuments(searchQuery);
          res.status(200).json({ data, totalDocs });
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

function refreshStock(items = []) {
  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $inc: { stock: -item.quantity } },
    },
  }));
  return Items.bulkWrite(bulkOps);
}
