import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Vote, LogOut, LayoutDashboard, Users, UserCheck, ShieldAlert, Award } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-white/20">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
      >
        <div className="bg-gradient-to-tr from-sky-400 to-emerald-400 p-2 rounded-xl text-white shadow-md">
          <Vote size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
          CampusVote
        </span>
      </div>

      {/* Navigation Options */}
      <div className="flex items-center gap-2 md:gap-4">
        {user.role === 'student' ? (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                isActive('/dashboard') 
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-700 hover:bg-white/30'
              }`}
            >
              <Vote size={18} />
              <span>Vote</span>
            </button>
            <button
              onClick={() => navigate('/results')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                isActive('/results') 
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-700 hover:bg-white/30'
              }`}
            >
              <Award size={18} />
              <span>Results</span>
            </button>
          </>
        ) : (
          /* Admin Navigation */
          <>
            <button
              onClick={() => navigate('/admin')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm md:text-base ${
                isActive('/admin') 
                  ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-700 hover:bg-white/30'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/results')}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm md:text-base ${
                isActive('/results') 
                  ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-700 hover:bg-white/30'
              }`}
            >
              <Award size={18} />
              <span className="hidden sm:inline">Election Results</span>
            </button>
          </>
        )}

        {/* User Info & Logout Button */}
        <div className="h-6 w-px bg-slate-300/60 mx-1"></div>
        
        <div className="hidden lg:flex flex-col text-right">
          <span className="font-semibold text-sm text-slate-800">
            {user.role === 'admin' ? 'Administrator' : user.name}
          </span>
          <span className="text-xs text-slate-500">
            {user.role === 'admin' ? user.email : user.collegeId}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-300"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
