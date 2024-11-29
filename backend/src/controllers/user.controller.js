import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUploadCloud } from "../utils/cloudinary.js";
import { UserLoginType, cookieOptions } from "../utils/constant.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import bcrypt from "bcrypt";

import {
  sendOtpEmail,
  randomInt,
  sendForgotPasswordEmail,
} from "../utils/mailer.js";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        400,
        "something is wrong while getting user in generate and access tokens"
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "something is wrong while generationg access and refresh tokens"
    );
  }
};

const Register = asyncHandler(async (req, res) => {
  const { username = "", email = "", fullname = "", password = "" } = req.body;
  if (
    [username, email, password, fullname].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(409, "Please Provide all Fields..");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    const duplicateField = existedUser.email === email ? "email" : "username";
    throw new ApiError(400, `User already exists with this ${duplicateField}`);
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullname,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "something wrong while registering the user");
  }
  const otp = randomInt(100000, 999999);
  await sendOtpEmail(email, otp);

  user.otp = Number(otp);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Register Successfully.."));
});

const UserOtpVerify = asyncHandler(async (req, res) => {
  const { email = "", otp = "" } = req.body;

  if (!email.trim() || !otp.trim()) {
    throw new ApiError(400, "Please provide both email and OTP.");
  }

  // Find the user with the provided email
  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found with the provided email.");
  }

  // Check if OTP matches
  if (user.otp !== Number(otp)) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  const resetToken = user.generateResetToken();

  user.otp = undefined; // Remove the OTP field
  user.isEmailVerified = true;
  user.resetToken = resetToken;
  await user.save(); // Save the changes to the database

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Email verified successfully."));
});

const LoginUser = asyncHandler(async (req, res) => {
  const { username = "", password } = req.body;

  if (!username) {
    throw new ApiError(400, "email or username is Required.");
  }

  const userCheck = await User.findOne({
    $or: [{ email: username }, { username: username }],
  });

  if (!userCheck) {
    throw new ApiError(409, "Please enter Valid username or Email");
  }

  if (userCheck.loginType !== UserLoginType.EMAIL_PASSWORD) {
    // If user is registered with some other method, we will ask him/her to use the same method as registered.
    // This shows that if user is registered with methods other than email password, he/she will not be able to login with password. Which makes password field redundant for the SSO
    throw new ApiError(
      400,
      "You have previously registered using " +
        userCheck.loginType?.toLowerCase() +
        ". Please use the " +
        userCheck.loginType?.toLowerCase() +
        " login option to access your account."
    );
  }

  const passwordVerify = await userCheck.isPasswordCompare(password);

  if (!passwordVerify) {
    throw new ApiError(400, "Please Enter Valid Credential.");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    userCheck?._id
  );

  const loggedInUser = await User.findById(userCheck?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Login Successfully"
      )
    );
});

const LogoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("clone_app", cookieOptions)
      .clearCookie("connect.sid", cookieOptions)
      .json(new ApiResponse(200, {}, "User logged Out"));
  } catch (error) {
    throw new ApiError(400, "something wrong while logouting User");
  }
});
const UserGetWebapp = asyncHandler(async (req, res) => {
  try {
    try {
      const response = await axios.get("https://www.wikipedia.org");
      return res
        .status(200)
        .json(new ApiResponse(200, response.data, "Register Successfully.."));
    } catch (error) {
      return res
        .status(200)
        .json(new ApiResponse(200, error, "failed Successfully.."));
    }
  } catch (error) {
    throw new ApiError(400, "something wrong while logouting User", error);
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookie?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unAuthorizied request");
  }

  try {
    const decodeRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "inValid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token Expired");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid Refresh Token");
  }
});

const VerifyEmailForPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email is Required.");
  }

  const userCheck = await User.findOne({ email }).select(
    "-password -refreshToken"
  );

  if (!userCheck) {
    throw new ApiError(409, "Please enter Valid Email");
  }
  const otp = randomInt(100000, 999999);
  await sendForgotPasswordEmail(userCheck?.email, otp);

  userCheck.otp = Number(otp);
  await userCheck.save();

  return res
    .status(200)
    .json(new ApiResponse(200, userCheck, "verify email and send otp"));
});

const UpdatePassword = asyncHandler(async (req, res) => {
  const { email, password, token } = req.body;

  if (!email || !password || !token) {
    throw new ApiError(400, "Email, password, and token are required.");
  }
  const userCheck = await User.findOne({ email }).select(
    "-password -refreshToken"
  );

  if (!userCheck) {
    throw new ApiError(409, "Please enter Valid Email");
  }

  const isValidToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!isValidToken) {
    throw new ApiError(403, "Invalid or expired token.");
  }
  userCheck.password = password;
  userCheck.resetToken = undefined;
  await userCheck.save();

  return res
    .status(200)
    .json(new ApiResponse(200, userCheck, "password Updated successfully"));
});

const getUserData = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req?.user, "UserData Fetched successFully"));
});

const handleSocialLogin = asyncHandler(async (req, res) => {
  console.log("come in >>>>>>>>>>>>>>>>>>>>>>>");
  debugger;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user?._id
  );

  return res
    .status(301)
    .cookie("accessToken", accessToken, cookieOptions) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, cookieOptions) // set the refresh token in the cookie
    .redirect(
      // redirect user to the frontend with access and refresh token in case user is not using cookies
      `${process.env.CLIENT_SSO_REDIRECT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
});

export {
  Register,
  LoginUser,
  LogoutUser,
  refreshAccessToken,
  getUserData,
  handleSocialLogin,
  UserGetWebapp,
  UserOtpVerify,
  VerifyEmailForPassword,
  UpdatePassword,
};
