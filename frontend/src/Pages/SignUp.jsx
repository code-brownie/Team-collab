import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const SignUp = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Sign-up successful!");
        login(data.token);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Sign-up failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign up</h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email and Password */}
          <div className="flex space-x-4 mb-6">
            <div className="w-1/2">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-400 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Confirm your password"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
              <Link to="/signIn" className="font-medium text-yellow-500 hover:underline">
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
