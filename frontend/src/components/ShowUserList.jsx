/* eslint-disable react/prop-types */
const ShowUserList = ({ members, removeMember, heading }) => {

    return (
        <>
            {members.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">{heading}</h3>
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

        </>
    )
}

export default ShowUserList