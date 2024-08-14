const otpStore = new Map();

exports.setOtp = (email, otp) => {
  otpStore.set(email, otp);
};

exports.verifyOtp = (email, otp) => {
  return otpStore.get(email) === otp;
};

exports.clearOtp = (email) => {
  otpStore.delete(email);
};