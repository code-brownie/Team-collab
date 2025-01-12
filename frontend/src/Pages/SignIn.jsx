import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const { toast } = useToast();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard.",
          variant: "default",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign in</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-800 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-800"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-800 text-lg p-3 shadow-sm focus:outline-none focus:border-indigo-800"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white text-lg font-semibold py-3 px-4 rounded ${loading
                ? "bg-gray-800 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-600"
                }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              Need an account?{" "}
              <Link to="/signUp" className="font-medium text-gray-800 hover:underline">
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
