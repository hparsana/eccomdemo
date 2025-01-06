import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    stack: { type: String, required: true },
    statusCode: { type: Number, default: 500 },
    error: { type: mongoose.Schema.Types.Mixed }, // Store additional error details
    method: { type: String },
    route: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);

export default ErrorLog;
