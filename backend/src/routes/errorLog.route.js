import express from "express";

import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  getErrorLogs,
  getFileLogs,
} from "../controllers/errorLog.controller.js";

const routes = express.Router();

routes.get("/error-logs", authMiddleWare(["ADMIN"]), getErrorLogs);
routes.get("/error-filelogs", getFileLogs);

routes.get("/simulate-error", (req, res, next) => {
  const error = new Error("Simulated server crash");
  error.statusCode = 500;
  next(error); // Pass the error to the middleware
});
export default routes;
