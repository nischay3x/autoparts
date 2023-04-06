import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  price: { type: Number, default: 0, min: 0 },
  desc: { type: String },
});

const Items = mongoose.models.items || mongoose.model("items", schema);
export default Items;
