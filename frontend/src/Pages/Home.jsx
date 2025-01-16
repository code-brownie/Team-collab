import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { features } from "@/data/Features";
import { toast } from "@/hooks/use-toast";


export default function Home() {
    const { token, logout } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const checkAuthStatus = () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {

                const parts = token.split('.');
                if (parts.length !== 3) {
                    console.error("Invalid token format");
                    logout();
                    return;
                }


                const payload = JSON.parse(atob(parts[1]));


                const currentTime = Math.floor(Date.now() / 1000);

                if (payload.exp && payload.exp < currentTime) {
                    logout();
                    setIsAuthenticated(false);
                    toast({
                        title: 'session expired',
                        description: 'Please signIn again',
                        variant: 'default'
                    })


                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error validating token:", error);
                logout();
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, [token, logout]);

    const NavigationButton = () => {
        if (isAuthenticated) {
            return (
                <Link
                    to="/dashboard"
                    className="bg-gray-900 text-white text-base md:text-lg font-semibold px-4 md:px-6 py-2 rounded-full hover:bg-gray-700"
                >
                    Dashboard
                </Link>
            );
        }
        return (
            <Link
                to="/signUp"
                className="bg-gray-900 text-white text-base md:text-lg font-semibold px-4 md:px-6 py-2 rounded-full hover:bg-gray-700"
            >
                Get Started
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="w-full flex justify-between items-center px-4 md:px-8 py-4">
                <div className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-8 h-8 mr-2"
                    />
                    <span className="text-2xl md:text-3xl font-bold text-gray-800">Team-collab</span>
                </div>
                <NavigationButton />
            </header>

            <section className="text-center my-8 md:my-16 px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                    Organize your <br />
                    projects in
                    <span className="text-yellow-500"> time.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8">
                    Create Project, Manage, share files and to-do. <br />
                    In a calendar.
                </p>
                {!isAuthenticated && <Link
                    to="/signUp"
                    className="bg-gray-900 text-white text-lg font-semibold px-6 md:px-8 py-3 rounded-full hover:bg-gray-700 inline-block"
                >
                    Get started
                </Link>}
            </section>

            <div className="my-1 flex justify-center px-4">
                <img
                    src="/landing1.png"
                    alt="Project Calendar"
                    className="w-full max-w-5xl rounded-lg shadow-xl"
                />
            </div>



            {/* Features Section */}
            <section id="features" className="py-16 px-4 md:px-8 bg-white">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    Everything you need for team collaboration
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <feature.icon className="w-8 h-8 text-yellow-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-gray-900 text-white py-16 px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to get started?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of teams who are already using Team-collab to improve their project management and team collaboration.
                </p>
                <Link
                    to="/signUp"
                    className="bg-yellow-500 text-gray-900 text-lg font-semibold px-8 py-3 rounded-full hover:bg-yellow-400 inline-block"
                >
                    Start your free trial
                </Link>
            </section>


            <footer className="w-full bg-gray-900 text-white py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-8 h-8 mr-2"
                        />
                        <span className="text-xl font-bold">Team-collab</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-yellow-500">Privacy</a>
                        <a href="#" className="hover:text-yellow-500">Terms</a>
                        <a href="#" className="hover:text-yellow-500">Contact</a>
                    </div>
                    <p className="text-sm text-gray-400">&copy; 2024 Team-collab. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}