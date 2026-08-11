import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Vote, Loader2, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Login = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'admin'
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (activeTab === 'student') {
        response = await api.post('/auth/student/login', { collegeId, password });
      } else {
        response = await api.post('/auth/admin/login', { email, password });
      }

      // Success
      localStorage.setItem('user', JSON.stringify(response.data));
      onLoginSuccess(response.data);

      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-white/40">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 p-8 text-center border-b border-white/15">
          <div className="inline-flex bg-gradient-to-tr from-sky-400 to-emerald-400 p-3.5 rounded-2xl text-white shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Vote size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight animate-pulse">Campus Vote</h1>
          <p className="text-sm text-white/80 mt-2 font-medium">Secure & Transparent College Elections</p>
        </div>

        {/* Tabs Switcher */}
        <div className="flex p-2 bg-white/5 border-b border-white/10">
          <button
            onClick={() => { setActiveTab('student'); setError(''); }}
            className={`flex-1 py-3 text-center text-sm font-semibold rounded-2xl transition-all duration-300 ${
              activeTab === 'student'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            👨🎓 Student
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex-1 py-3 text-center text-sm font-semibold rounded-2xl transition-all duration-300 ${
              activeTab === 'admin'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            👨💼 Admin
          </button>
        </div>

        {/* Input Form Body */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50/80 border border-rose-200/80 text-rose-600 text-sm px-4 py-3 rounded-2xl font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Student Login Field */}
          {activeTab === 'student' ? (
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/90 block">Mobile Number / College ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., 9876543210 or 22EEE101"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-3 rounded-2xl text-white placeholder-white/30 font-medium text-sm"
                />
              </div>
            </div>
          ) : (
            /* Admin Login Field */
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/90 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-3 rounded-2xl text-white placeholder-white/30 font-medium text-sm"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/90 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input block w-full pl-10 pr-4 py-3 rounded-2xl text-white placeholder-white/30 font-medium text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl text-sm font-bold text-white shadow-xl focus:outline-none transition-all duration-300 ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : activeTab === 'student'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-500/20'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Secure Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
