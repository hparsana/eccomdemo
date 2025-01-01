"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import { USERS } from "../utils/constant";
import useAxios from "../utils/commonAxios";
import withAuth from "../components/Auth/withAuth";
import { getUserData } from "../store/Auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const { userLoggedIn } = useSelector((data) => data?.userAuthData);
  const [loginLoading, setLoginLoading] = useState(false);
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
  const searchParams = useSearchParams();

  // Function to check if the input is an email
  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(input);
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      setLoginLoading(true);
      const res = await axios.post(USERS.LOGIN_USER_API, data);
      console.log("res is<<", res);

      if (res?.data?.success) {
        localStorage.setItem("userEmail", res?.data?.data?.user?.email);
        localStorage.setItem("accessToken", res?.data?.data?.accessToken);
        localStorage.setItem("refreshToken", res?.data?.data?.refreshToken);

        toast.success("Login Successful!");
        reset();

        dispatch(getUserData());
        setLoginLoading(false);

        const pageRedirecrt = searchParams.get("page");

        if (pageRedirecrt) {
          console.log(pageRedirecrt, "jenish<<<<<<<<");
          router.push("/productdata/address");
          return;
        }
        router.push("/");
      } else {
        toast.error("Invalid username or password.");
        setLoginLoading(false);
      }
      //   reset();
    } catch (error) {
      console.log(error);

      toast.error("Invalid username or password.");
      setLoginLoading(false);

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
                {!loginLoading ? (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Login
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
