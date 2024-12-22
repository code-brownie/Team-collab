/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";

const AddMembersForm = ({ members, setMembers, backStep, handleSubmit }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searching, setSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/all");
                const data = await response.json();
                // console.log('Data in the user', data.users);
                setAllUsers(data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.trim();
        setSearchTerm(term);
        console.log(allUsers);
        if (term) {
            setSearching(true);
            const timeoutId = setTimeout(() => {
                const filteredUsers = allUsers.filter((user) =>
                    user.email.toLowerCase().includes(term.toLowerCase())
                );
                setSearchResults(filteredUsers);
                setSearching(false);
            }, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
        }
    };

    const addMember = (member) => {
        if (!members.includes(member)) {
            setMembers([...members, member]);
        }
        setSearchTerm("");
        setSearchResults([]);
    };

    const removeMember = (member) => {
        setMembers(members.filter((m) => m !== member));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await handleSubmit();
        } catch (error) {
            console.error("Error during form submission:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <h2 className="text-xl font-semibold mb-4">Add Members</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Search Members</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Search by email"
                />
            </div>
            {searching && <p className="text-sm text-gray-500">Searching...</p>}
            {searchResults.length > 0 && (
                <ul className="mb-4 list-none border rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((result, index) => (
                        <li
                            key={index}
                            onClick={() => addMember(result)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                            {result.email}
                        </li>
                    ))}
                </ul>
            )}
            {members.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Added Members</h3>
                    <ul className="list-none">
                        {members.map((m, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center py-2 px-4 border rounded-lg mb-2"
                            >
                                <span>{m.email}</span>
                                <button
                                    type="button"
                                    onClick={() => removeMember(m)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={backStep}
                    className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className={`py-2 px-4 rounded-lg ${submitting
                        ? "bg-gray-600 text-white cursor-not-allowed"
                        : "bg-gray-900 text-white"
                        }`}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
};

export default AddMembersForm;
