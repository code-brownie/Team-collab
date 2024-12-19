import { useState } from "react";

const CreateTeam = () => {
    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: teamName,
                    description: teamDescription,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Team created successfully!");
                // Redirect to the dashboard or team page
                window.location.href = "/dashboard";
            } else {
                setError(data.message || "An error occurred");
            }
        } catch (err) {
            console.log(err.message);
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create a Team</h2>
                {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="team-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Team Name
                        </label>
                        <input
                            id="team-name"
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your team name"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="team-description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Team Description (Optional)
                        </label>
                        <textarea
                            id="team-description"
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe your team"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 text-white font-medium rounded-md focus:outline-none ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Team"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTeam;
