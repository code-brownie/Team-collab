import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/spinner";


const SignUp = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL_DEV;


  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password not match.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${URL}/users/signup`, {
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
        login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        });
        toast({
          title: "SignUp Successful",
          description: "Welcome back! Redirecting to your dashboard.",
          variant: "default",
        });
        setLoading(false);
        navigate('/dashboard');
      } else {
        toast({
          title: "SignUp Failed",
          description: data.message || "Try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
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
          </div>

          {/* Sign Up Button */}
          <div className="mt-8">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-600 text-white text-lg font-semibold py-3 px-4 rounded"
            >
              {loading ? (<div className="flex justify-center"><Spinner height={'50'} width={'50'} color={'#FFFFFF'} /></div>) : "SignUp"}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              Already have an account?{" "}
              <Link to="/signIn" className="font-medium text-gray-900 hover:underline">
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
