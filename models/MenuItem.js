import { Schema, model, models } from "mongoose";

const MenuItemSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Menu.sections",
    },
  },
  { timestamps: true }
);

export default models.MenuItem || model("MenuItem", MenuItemSchema);
