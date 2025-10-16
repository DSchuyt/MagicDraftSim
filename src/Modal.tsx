import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 min-w-[600px] relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-700 text-xl text-white w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center font-bold" onClick={onClose} aria-label="Close modal">
          <span className="-mt-[5px]">x</span>
        </button>
        {children}
      </div>
    </div>
  )
};

export default Modal;