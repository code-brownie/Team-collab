/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { toast } from "@/hooks/use-toast";

const AddMember = ({ onClose, joinCode }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { userId } = useContext(AuthContext);
    const [email, setEmail] = useState("");
const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV;
    // Function to send invitation email
    const sendInvitation = async () => {
        if (!email) {
            setError("Please enter an email address");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Send the invitation email using your backend API
            const response = await fetch(`${URL}/email/send-invitation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    joinCode,
                    inviterId: userId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send invitation');
            }
            toast({
                title: "success",
                description: "Invitation sent successfully.",
                variant: "default",
            });
            onClose();

        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to send invitation.",
                variant: "destructive",
            });
            console.error(err);
            setError("Failed to send invitation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg w-full max-w-md bg-white p-6">
            {error && (
                <p className="text-red-500 mb-4 text-sm bg-red-50 p-2 rounded">
                    {error}
                </p>
            )}

            <div className="flex flex-col mb-4">
                <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-2">
                    Enter Member Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none"
                    disabled={loading}
                />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={sendInvitation}
                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        'Send Invitation'
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddMember;