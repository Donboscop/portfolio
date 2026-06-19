import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, Hash, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import '../components/CustomAnimation.css';

const AdminLogin = () => {
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Step 1: Send OTP code to console
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid administrator email.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    const result = await sendOtp(email);
    setLoading(false);

    if (result.success) {
      setIsOtpSent(true);
      setStatusMessage('Verification code generated! Please check your server console log.');
    } else {
      setError(result.message || 'Verification failed. Make sure email matches admin record.');
    }
  };

  // Step 2: Verify OTP code and Log In
  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Invalid or expired verification code.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center grid-pattern py-12 px-4 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-sm text-center">

          {/* Badge Icon */}
          <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Secure Admin Login
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Access the dashboard via passwordless verification code checks.
          </p>

          {/* Success Status Banner */}
          {statusMessage && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-semibold text-left animate-fade-in-up">
              {statusMessage}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-400 text-left animate-fade-in-up">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-semibold">{error}</span>
            </div>
          )}

          {/* 1. Step 1: Input Email Form */}
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6 text-left animate-fade-in-up">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="example123@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-6 py-3.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer hover-spring disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Get Verification Code</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* 2. Step 2: Input Verification Code Form */
            <form onSubmit={handleVerifyLogin} className="space-y-6 text-left animate-modal-content">
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // accepts numbers only
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all text-sm tracking-widest font-mono text-center font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  We've sent a 6-digit code to your local server terminal log. Please copy and enter it.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setError(null);
                    setStatusMessage(null);
                    setOtp('');
                  }}
                  className="flex items-center justify-center px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center flex-1 px-6 py-3.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer hover-spring disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Verify & Log In</span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
