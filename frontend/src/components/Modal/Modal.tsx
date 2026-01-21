import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  button?: React.ReactNode;
  children: React.ReactNode;
  crossIcon?: boolean;
  toggleModal: () => void;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ button, children, crossIcon = true, toggleModal, isOpen }) => {
  return (
    <>
      {button && (
        <div onClick={toggleModal}>
          {button}
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div
                className="absolute inset-0  bg-opacity-40 backdrop-blur-sm"
                onClick={toggleModal}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
              {crossIcon && (
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
                  onClick={toggleModal}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}
              <div className="bg-white px-6 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;