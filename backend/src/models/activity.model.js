import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g., "updated profile", "added address"
  additionalInfo: { type: Object }, // Any additional info about the action
  timestamp: { type: Date, default: Date.now },
});

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
