"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import { USERS } from "../utils/constant";
import useAxios from "../utils/commonAxios";
import withAuth from "../components/Auth/withAuth";
import { getUserData } from "../store/Auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const LoginPage = () => {
  const { userLoggedIn } = useSelector((data) => data?.userAuthData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  useEffect(() => {
    if (userLoggedIn) {
      router.push("/"); // Redirect to home page
    }
  }, [userLoggedIn, router]);

  const axios = useAxios();
  const dispatch = useDispatch();

  // Function to check if the input is an email
  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(input);
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(USERS.LOGIN_USER_API, data);
      console.log("res is<<", res);

      if (res?.data?.success) {
        localStorage.setItem("userEmail", res?.data?.data?.user?.email);
        localStorage.setItem("accessToken", res?.data?.data?.accessToken);
        localStorage.setItem("refreshToken", res?.data?.data?.refreshToken);

        toast.success("Login Successful!");
        reset();

        dispatch(getUserData());
        router.push("/");
      } else {
        toast.error("Invalid username or password.");
      }
      //   reset();
    } catch (error) {
      console.log(error);

      toast.error("Invalid username or password.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-200 to-blue-300 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Image Section */}
          <div className="relative md:w-1/2 h-64 md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1529539795054-3c162aab037a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cool Background"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover w-full h-full rounded-l-lg"
            />
          </div>
          {/* Right Form Section */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-500 text-center mb-6">
              Welcome Back!
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Username or Email */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Username or Email
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username", {
                    required: "Please enter your username or email",
                  })}
                  className={`w-full px-4 py-2 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                  placeholder="Enter your username or email"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    validate: (value) =>
                      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
                        value
                      ) ||
                      "Password must contain at least one uppercase, one lowercase, one number, and one special character",
                  })}
                  className={`w-full px-4 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* Login Button */}
              <p className="text-sm text-gray-600 text-right ">
                Forgot your password?{" "}
                <Link href="/forgotpassword" passHref>
                  <span className="text-blue-500 hover:underline">
                    Reset it here
                  </span>
                </Link>
              </p>
              <div className="mb-4 mt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Login
                </button>
              </div>
            </form>
            {/* Additional Links */}
            <p className="text-sm text-gray-600 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" passHref>
                <span className="text-blue-500 hover:underline">
                  Register here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(LoginPage, false);
