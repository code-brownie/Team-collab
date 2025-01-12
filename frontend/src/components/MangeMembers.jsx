/* eslint-disable react/prop-types */
import { useState } from "react";

const MangeMembers = ({ members, handleSubmit, onClose }) => {
    const [localMembers, setLocalMembers] = useState(members);

    const removeMember = (member) => {
        setLocalMembers((prevMembers) => prevMembers.filter((m) => m.id !== member.id));
    };

    const saveChanges = () => {
        handleSubmit(localMembers);
    };

    return (
        <>
            {localMembers.length > 0 && (
                <div className="mb-4">
                    <ul className="list-none">
                        {localMembers.map((m, index) => (
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
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={saveChanges}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    Save
                </button>
            </div>
        </>
    );
};

export default MangeMembers;
