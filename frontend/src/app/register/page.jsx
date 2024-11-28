"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import { USERS } from "../utils/constant";
import axios from "../utils/commonAxios";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP
  const [LoadingApi, setLoadingApi] = useState(false); // To store user's email for OTP verification

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("emailVerify");
      console.log("name is<<<<", userEmail);

      if (userEmail !== null && userEmail !== undefined && userEmail !== "") {
        setStep(2);
      }
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      try {
        setLoadingApi(true);
        const res = await axios.post(USERS.REGISTER_USER_API, data);

        if (res?.data?.success) {
          toast.success("Registration Successful!");
          localStorage.setItem("emailVerify", res?.data?.data?.email);
          setStep(2);
          setLoadingApi(false);
        } else {
          toast.error("Invalid username or password.");
          setLoadingApi(false);
        }

        //   reset();
      } catch (error) {
        toast.error("Invalid username or password.");
        setLoadingApi(false);
        return;
      }
    } catch (error) {
      //   console.error("Error during registration:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = async (data) => {
    const userEmail = localStorage.getItem("emailVerify");
    if (userEmail !== null && userEmail !== undefined && userEmail !== "") {
      try {
        setLoadingApi(true);
        const userInfo = { email: userEmail, otp: data.otp };
        const res = await axios.post(USERS.VERIFY_USER_OTP, userInfo);
        if (res?.data?.success) {
          toast.success("Otp Verify Successful!");
          localStorage.removeItem("emailVerify");
          setLoadingApi(false);
        } else {
          toast.error("Invalid username or password.");
          setLoadingApi(false);
        }
      } catch (error) {
        setLoadingApi(false);
        toast.error("Something went wrong. Please try again.");
      }
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
            {step === 1 ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-500 text-center mb-6">
                  Sign-up!
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Username or Email */}
                  <div className="mb-4">
                    <label
                      htmlFor="fullname"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Fullname
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      {...register("fullname", {
                        required: "Please enter your fullname ",
                        minLength: {
                          value: 4,
                          message:
                            "fullname must be at least 4 characters long",
                        },
                      })}
                      className={`w-full px-4 py-2 border ${
                        errors.fullname ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                      placeholder="Enter your fullname "
                    />
                    {errors.fullname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      {...register("username", {
                        required: "Please enter your username",
                        minLength: {
                          value: 4,
                          message:
                            "Username must be at least 4 characters long",
                        },
                      })}
                      className={`w-full px-4 py-2 border ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      {...register("email", {
                        required: "Please enter your email",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={`w-full px-4 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
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
                          message:
                            "Password must be at least 8 characters long",
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
                  <div className="mb-4">
                    {!LoadingApi ? (
                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        Register
                      </button>
                    ) : (
                      <button
                        disabled
                        type="button"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
                      >
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 me-3 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        Loading...
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-500 text-center mb-6">
                  Verify OTP
                </h2>
                <form onSubmit={handleSubmit(handleVerifyOtp)}>
                  <div className="mb-4">
                    <label
                      htmlFor="otp"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      OTP
                    </label>
                    <input
                      type="number"
                      id="otp"
                      {...register("otp", {
                        required: "Please enter your otp",
                        minLength: {
                          value: 6,
                          message: "otp must be at least 6 number long",
                        },
                        maxLength: {
                          value: 6,
                          message: "otp max be  6 number long",
                        },
                      })}
                      className={`w-full px-4 py-2 border ${
                        errors.otp ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                      placeholder="Enter your otp"
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.otp.message}
                      </p>
                    )}
                  </div>

                  {!LoadingApi ? (
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Verify OTP
                    </button>
                  ) : (
                    <button
                      disabled
                      type="button"
                      className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Loading...
                    </button>
                  )}
                </form>
              </>
            )}
            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" passHref>
                <span className="text-blue-500 hover:underline">
                  Login here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
