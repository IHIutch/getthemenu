import { Schema, model, models } from "mongoose";

const MenuItemSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
  },
  { timestamps: true }
);

export default models.MenuItem || model("MenuItem", MenuItemSchema);
