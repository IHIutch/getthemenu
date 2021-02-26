import { Schema, model, models } from "mongoose";

const MenuSchema = new Schema(
  {
    name: String,
    sections: [
      {
        name: String,
        items: [
          {
            name: String,
            price: Number,
            description: String,
          },
        ],
      },
    ],
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  { timestamps: true }
);

export default models.Menu || model("Menu", MenuSchema);
