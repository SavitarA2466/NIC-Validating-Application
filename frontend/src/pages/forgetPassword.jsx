import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

axios.defaults.baseURL = 'http://localhost:3001/auth';

Modal.setAppElement('#root');

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
                    title: 'Error',
                    text: 'Failed to send OTP',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error sending OTP',
            });
        }
    };

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
                title: 'Error',
                text: 'Error verifying OTP',
            });
        }
    };

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
                    title: 'Error',
                    text: 'Failed to change password',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error changing password',
            });
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPassword('');
    };

    return (
        <div className="forgot-container">
            <div className="forgot-form">
                <h2 className="title">Forgot your password?</h2>
                <p className="subtitle">Enter your email to receive an OTP for password reset.</p>

                <form>
                    <div className="input-group">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleEmailSubmit}
                        className="btn-primary"
                    >
                        Continue
                    </button>

                    {emailSubmitted && !isOtpVerified && (
                        <>
                            <div className="input-group mt-4">
                                <label htmlFor="otp" className="label">Enter OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter the OTP sent to your email"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="btn-primary mt-4"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </form>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2 className="modal-title">Change Password</h2>
                    <div className="input-group mb-4">
                        <label htmlFor="newPassword" className="label">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input-field"
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleChangePassword}
                        className="btn-primary"
                    >
                        Confirm
                    </button>
                </Modal>
            </div>
        </div>
    );
}

export default Forgot;



