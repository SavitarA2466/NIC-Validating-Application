import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3001/auth'; 

Modal.setAppElement('#root'); // Ensure accessibility by specifying the root element

function Forgot() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); 

    const handleEmailSubmit = async () => {
        try {
            
            const response = await axios.post('/send-otp', { email });
            if (response.status === 200) {
                setEmailSubmitted(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to send OTP',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error sending OTP',
            });
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        try {
            
            const response = await axios.post('/verify-otp', { email, otp });
            if (response.status === 200) {
                setIsOtpVerified(true);
                handleOpenModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid OTP',
                    text: 'The OTP you entered is incorrect.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error verifying OTP',
            });
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        try {
            
            const response = await axios.post('/change-password', { email, newPassword });
            if (response.status === 200) {
                handleCloseModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password changed successfully',
                }).then(() => {
                    navigate('/'); 
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to change password',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error changing password',
            });
        }
    };

    // Open the password change modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Close the password change modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPassword(''); 
    };

    return (
        <div className="flex justify-center items-center h-screen bg-light-cyan-50 ml-auto mr-auto">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Forgot your password?</h2>
                </div>

                <form>
                    <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleEmailSubmit}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Continue
                    </button>

                    {emailSubmitted && !isOtpVerified && (
                        <>
                            <div className="mt-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="otp">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </form>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    className="bg-white p-8 shadow-lg rounded-lg max-w-md mx-auto my-20 outline-none"
                    overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleChangePassword}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Confirm
                    </button>
                </Modal>
            </div>
        </div>
    );
}

export default Forgot;


