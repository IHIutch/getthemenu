import { Schema, model, models } from "mongoose";

const RestaurantSchema = new Schema(
  {
    name: String,
    phone: [String],
    address: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
      },
    ],
    hours: [String],
    coverImage: {
      url: String,
      blurHash: String,
    },
    menus: [
      {
        type: Schema.Types.ObjectIdypes.ObjectId,
        ref: "Menu",
      },
    ],
  },
  { timestamps: true }
);

export default models.Restaurant || model("Restaurant", RestaurantSchema);
