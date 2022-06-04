import mongoose from "mongoose";
const AddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    housenumber: {
      type: String,
      required: true,
    },
    fulladdress: {
      type: String,
      maxlength: 100,
      minlength: 1,
      required: false,
    },
    landmark: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Address = new mongoose.model("Address", AddressSchema);
