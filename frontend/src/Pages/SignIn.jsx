import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard or another page
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred.");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign in</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-500 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-500 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
            <a href="#" className="absolute right-0 mt-1 text-sm text-gray-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
              <Link to="/signUp" className="font-medium text-yellow-500 hover:underline">
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
