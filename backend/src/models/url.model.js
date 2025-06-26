import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    visitHistory: [
      {
        timestamps: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export const URL = mongoose.model("URL", urlSchema)