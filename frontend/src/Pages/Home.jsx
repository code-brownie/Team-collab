import React from "react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Header */}
            <header className="w-full flex justify-between items-center px-8 py-4">
                <div className="text-3xl font-extrabold text-gray-900">Assemble</div>
                <nav className="flex items-center space-x-6 text-gray-700">
                    <a href="#" className="text-lg hover:text-gray-900">
                        Pricing
                    </a>
                    <a href="#" className="text-lg hover:text-gray-900">
                        Log in
                    </a>
                    <a
                        href="#"
                        className="bg-gray-900 text-white text-lg font-semibold px-6 py-2 rounded-full hover:bg-gray-700"
                    >
                        Sign Up →
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="text-center my-16 px-4">
                <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                    Organize your <br />
                    projects in
                    <span className="text-yellow-500"> time.</span>
                </h1>
                <p className="text-2xl text-gray-600 mb-8">
                    Every file, note, convo and to-do. <br />
                    In a calendar.
                </p>
                <button className="bg-gray-900 text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-gray-700">
                    Start Free
                </button>
            </section>

            {/* Image Section */}
            <div className="my-8 flex justify-center">
                {/* Replace 'your-image-url' with the image */}
                <img
                    src="src/assets/landing.jpg"
                    alt="Project Calendar"
                    className="w-full max-w-5xl rounded-lg shadow-lg"
                />
            </div>


            {/* Footer */}
            <footer className="w-full bg-gray-900 text-white py-4 text-center">
                <p className="text-sm font-medium">&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
