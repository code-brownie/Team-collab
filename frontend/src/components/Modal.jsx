/* eslint-disable react/prop-types */
import { X } from 'lucide-react';
const Modal = ({ isOpen, onClose, children, heading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{heading}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
