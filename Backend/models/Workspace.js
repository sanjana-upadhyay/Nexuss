const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["hotdesk", "dedicated", "cabin", "meeting", "managed"],
      default: "hotdesk",
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    price: {
      type: Number,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      required: true,
      default: 1,
    },
    areaSqft: {
      type: Number,
      default: 0,
    },
    floor: {
      type: String,
      default: "",
    },
    leaseTerm: {
      type: String,
      enum: ["daily", "monthly", "hourly"],
      default: "daily",
    },
    amenities: {
      wifi: { type: Boolean, default: false },
      meetingRoom: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      cafeteria: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
      reception: { type: Boolean, default: false },
      printer: { type: Boolean, default: false },
      housekeeping: { type: Boolean, default: false },
    },
    images: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);