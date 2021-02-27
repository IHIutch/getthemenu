import { Schema, model, modelsongoose";

const MenuSchema = new Schema(
  {
    name: String,
    sections: [
      {
        name: String,
      },
    ],
    restaurantId: {
      type: Schema.Types.ObjectIdypes.ObjectId,
      ref: "Restaurant",
    },
    menuItems: [
      {
        type: Schema.Types.ObjectIdypes.ObjectId,
        ref: "MenuItem",
      },
    ],
  },
  { timestamps: true }
);

export default models.Menu || model("Menu", MenuSchema);
