import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    items: { type: [Object], min: 1 },
    total: { type: Number, min: 0 },
    name: String,
    contact: String,
    type: String,
    paid: { type: Boolean, default: false },
    _id: String,
  },
  { timestamps: true, id: false }
);

const Sales = mongoose.models.sales || mongoose.model("sales", schema);
export default Sales;
