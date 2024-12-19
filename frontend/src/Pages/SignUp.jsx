import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign up</h2>

        <form>
          {/* Full Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email and Password on Same Line */}
          <div className="flex space-x-4 mb-6">
            {/* Email Field */}
            <div className="w-1/2">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="w-1/2">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-lg font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Confirm your password"
            />
          </div>

          {/* Sign Up Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold py-3 px-4 rounded"
            >
              Sign up
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              Already have an account?{" "}
              <Link
                to="/signIn"
                className="font-medium text-yellow-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
