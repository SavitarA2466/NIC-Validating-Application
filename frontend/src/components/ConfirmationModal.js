import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="bg-white p-8 shadow-lg rounded-lg max-w-md mx-auto my-20 outline-none"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmation</h2>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;