import express from "express";
import {
  LoginUser,
  LogoutUser,
  Register,
  getUserData,
  refreshAccessToken,
  handleSocialLogin,
  UserGetWebapp,
  UserOtpVerify,
  VerifyEmailForPassword,
  UpdatePassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { signUpSchemaValidation } from "../utils/schemaValidation.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import passport from "passport";
import "../passport/index.js";

const routes = express.Router();

routes.route("/register").post(validate(signUpSchemaValidation), Register);

routes.route("/login").post(LoginUser);

routes.route("/verify-otp").post(UserOtpVerify);

routes.route("/refresh-token").post(refreshAccessToken);

//Secure Routes to use Auth Middleware
routes.route("/logout").get(authMiddleWare, LogoutUser);

routes.route("/getwebsitescript").get(UserGetWebapp);

routes.route("/get-userdata").get(authMiddleWare, getUserData);

//forgot password APIS

routes.route("/forgotpassword/verifyemail").post(VerifyEmailForPassword);
routes.route("/forgotpassword/verifyemailotp").post(UserOtpVerify);
routes.route("/forgotpassword/verifypassword").post(UpdatePassword);

// SSO routes
routes.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

routes
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);
export default routes;
