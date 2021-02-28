import { Schema, model, models } from "mongoose";

const MenuSchema = new Schema(
  {
    name: String,
    sections: [
      {
        name: String,
      },
    ],
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    menuItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
  },
  { timestamps: true }
);

export default models.Menu || model("Menu", MenuSchema);
