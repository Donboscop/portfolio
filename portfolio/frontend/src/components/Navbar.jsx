import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import IconsaxIcon from './IconsaxIcon';
import './CustomAnimation.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Skills', path: '/skills' },
    { label: 'Projects', path: '/projects' },
    { label: 'Certifications', path: '/certifications' },
    { label: 'Resume', path: '/resume' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-2xl px-5 py-3 transition-all duration-300 border border-slate-200/40 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Brand Mark */}
          <Link to="/" className="flex items-center space-x-3 group">
            <IconsaxIcon name="sparkles" size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              DON BOSCO<span className="text-purple-600 dark:text-purple-400 font-normal ml-1.5 text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">Fluid</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/60 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dashboard or Admin Login shortcut */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/admin"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors"
                title="Admin Portal Login"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors cursor-pointer ml-1"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Admin Logout */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-white/5"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              to="/admin"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              {isAuthenticated ? <LayoutDashboard className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-white/5"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden pt-4 mt-3 border-t border-slate-200/50 dark:border-white/10 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100/60 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
            >
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}
            </Link>

            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-4 py-2.5 rounded-xl text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-5 w-5 mr-2" /> Log Out
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
