import React, { useState } from 'react';
import { Link as RLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const Header = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to the login page
    navigate('/');
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-20 fixed z-10 drop-shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <div className="flex items-center">
          <h2 className="text-lg text-white font-semibold sm:text-xl">{title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <RLink 
            to="/dashboard" 
            className="text-white hover:text-gray-200 font-semibold text-sm"
          >
            Dashboard
          </RLink>
          <RLink 
            to="/validator" 
            className="text-white hover:text-gray-200 font-semibold text-sm"
          >
            NIC Validator
          </RLink>
          <RLink 
            to="/management" 
            className="text-white hover:text-gray-200 font-semibold text-sm"
          >
            Reports
          </RLink>
          <button 
            type="button" 
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Logout
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        message="Are you sure you want to logout?"
      />
    </div>
  );
};

export default Header;
