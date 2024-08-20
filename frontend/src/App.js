import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Validator from "./pages/validator";
import Management from "./pages/management";
import Header from "./pages/header";
import ForgetPassword from './pages/forgetPassword';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="text-black hover:text-black font-bold text-sm">
              <Login />
            </div>
          } />
          <Route path="/signup" element={
            <div className="text-black hover:text-black font-bold text-sm">
              <Signup />
            </div>
          } />
          <Route path="/forgetpassword" element={
            <div className="text-black hover:text-black font-bold text-sm">
              <ForgetPassword />
            </div>
          } />
          <Route path="/dashboard" element={
              <div className="text-black hover:text-black font-bold text-sm">
                <Header title="Dashboard" />
                <Dashboard />
              </div>
          } />
          <Route path="/validator" element={
            <div className="text-black hover:text-black font-bold text-sm">
                <Header title="NIC Validator" />
                <Validator />
              </div>
          } />
          <Route path="/management" element={
            <div className="text-black hover:text-black font-bold text-sm">
                <Header title="Reports" />
                <Management />
              </div>
          } />
        </Routes>
        <Helmet>
          <title>NIC-Validating</title>
        </Helmet>
      </Router>
    </HelmetProvider>
  );
}

export default App;
