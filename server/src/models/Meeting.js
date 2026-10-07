
import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    meetingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      default: "My Meeting",
      trim: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        name: String,

        joinedAt: {
          type: Date,
          default: Date.now,
        },

        leftAt: {
          type: Date,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Meeting", meetingSchema);

