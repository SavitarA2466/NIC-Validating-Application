import React from 'react';
import { Link as RLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from the application!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {

        // Remove the token from localStorage
        localStorage.removeItem('token');
        
        // Redirect to the login page
        navigate('/');
        
      }
    });
  };

  return (
    <div className="w-screen h-20 z-10 bg-zinc-200 fixed drop-shadow-lg">
      <div className="px-2 flex justify-between items-center w-full h-full">
        <div className="flex items-center">
          <div>
            <h2 className="text-sm pl-1 text-gray-600 font-semibold sm:text-lg">{title}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-1">
          <RLink 
            to="/dashboard" 
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Dashboard
          </RLink>
          <RLink 
            to="/validator" 
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            NIC Validator
          </RLink>
          <RLink 
            to="/management" 
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Reports
          </RLink>
          <button 
            type="button" 
            onClick={handleLogout}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;


