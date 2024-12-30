/* eslint-disable react/prop-types */

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ShowUserList from "../components/ShowUserList";

const AddMembersForm = ({ members, setMembers, backStep, handleSubmit }) => {
    const { userId } = useContext(AuthContext);
    const UserId = userId.id;
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
                const filteredUsers = data.users.filter((user) => user.id !== UserId);
                setAllUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.trim();
        setSearchTerm(term);
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
            <ShowUserList members={members} heading={"Added Members"} removeMember={removeMember} />
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
