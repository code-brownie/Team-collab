/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
const SummaryCard = ({ title, value, change, changeColor }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm ${changeColor}`}>{change}</p>
        </div>
    );
};

export default SummaryCard;
