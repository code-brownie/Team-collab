/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Header */}
            <header className="w-full flex justify-between items-center px-8 py-4">
                <div className="flex items-center">
                  
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-8 h-8 mr-2" 
                    />
                    <span className="text-3xl font-bold text-gray-800">Team-collab</span>
                </div>
                <nav className="flex items-center space-x-6 text-gray-700">
                    <a href="#" className="text-gray-900 text-lg hover:text-gray-800">
                        Features
                    </a>
                    <Link to="/signIn" className="text-gray-900 text-lg hover:text-gray-800">
                        Log in
                    </Link>
                    <Link
                        to="/signUp"
                        className="bg-gray-900 text-white text-lg font-semibold px-6 py-2 rounded-full hover:bg-gray-700"
                    >
                        Sign Up →
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="text-center my-16 px-4">
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
                    Organize your <br />
                    projects in
                    <span className="text-yellow-500"> time.</span>
                </h1>
                <p className="text-2xl text-gray-600 mb-8">
                    Create Project, Manage, share files and to-do. <br />
                    In a calendar.
                </p>
                <button className="bg-gray-900 text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-gray-700">
                    Get started
                </button>
            </section>

            {/* Image Section */}
            <div className="my-1 flex justify-center">
                {/* Replace 'your-image-url' with the image */}
                <img
                    height={500}
                    width={1000}
                    src="/landing1.png"
                    alt="Project Calendar"
                    className="w-full scale-68 transition duration-700 ease-in-out"
                />
            </div>


            {/* Footer */}
            <footer className="w-full bg-gray-900 text-white py-4 text-center">
                <p className="text-sm font-medium">&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
