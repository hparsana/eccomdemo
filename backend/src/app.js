import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import passport from "passport";
import session from "express-session";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    name: "clone_app",
    // cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());

import userRoutes from "./routes/user.route.js";

app.get("/", (req, res) => {
  res.json(
    "This Apis Working Perfectly in Vercel it is just for checking pupose only so dont mind."
  );
});
app.use("/api/v1/user", userRoutes);
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err);
  }
  // Handle other types of errors or forward to default error handler
  return res.status(500).json({
    statusCode: 500,
    message: `Internal Server Error${err}`,
    success: false,
  });
});
export default app;
