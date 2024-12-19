import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign in</h2>

        <form>
          {/* Email Address Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 block w-full rounded-md border-gray-500 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 block w-full rounded-md border-gray-500 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
            />
            <a
              href="#"
              className="absolute right-0 mt-1 text-sm text-gray-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold py-3 px-4 rounded"
            >
              Sign in
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              Need an account?{" "}
              <Link
                to="/signUp"
                className="font-medium text-yellow-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
