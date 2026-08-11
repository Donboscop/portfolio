import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, VolumeX } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [profilePic, setProfilePic] = useState('/profile.jpg');
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to generate a crisp circular avatar favicon for the browser tab
  const setCircularFavicon = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 64; // High-DPI 64x64 favicon canvas
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Create circle clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw profile image centered inside circle
        ctx.drawImage(img, 0, 0, size, size);

        // Add subtle purple glowing border around circular avatar
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Apply generated circular PNG favicon to document head
        let faviconLink = document.querySelector("link[rel*='icon']");
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(faviconLink);
        }
        faviconLink.href = canvas.toDataURL('image/png');
      } catch (err) {
        console.warn('Fallback standard favicon:', err);
      }
    };
  };

  useEffect(() => {
    // Generate circular favicon on initial load with default profile pic
    setCircularFavicon('/profile.jpg');

    // Fetch live admin profile picture from backend
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch('/api/auth/admin-profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profilePic) {
            setProfilePic(data.profilePic);
            setCircularFavicon(data.profilePic);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic profile pic:', err);
      }
    };
    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const navItems = [
    { label: 'Projects', path: '/projects' },
    { label: 'Skills', path: '/skills' },
    { label: 'Milestones', path: '/about' },
    { label: 'Certificates', path: '/certifications' },
    { label: 'Resume', path: '/resume' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-full px-6 py-3.5 border border-white/10 shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo with Circular Profile Avatar */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-purple-500/60 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src={profilePic}
                alt="Don Bosco P"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = '/profile.jpg';
                }}
              />
            </div>
            <span className="font-editorial text-lg tracking-tight font-extrabold text-white">
              DON BOSCO <span className="text-purple-400 text-xs tracking-widest font-mono uppercase ml-1 opacity-70">P</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-white bg-purple-600/30 border border-purple-500/50 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="h-4 w-[1px] bg-white/15 mx-2" />

            {/* Audio Visualizer Button */}
            <button
              onClick={toggleAudio}
              className="p-2 rounded-full text-slate-300 hover:text-purple-400 hover:bg-white/5 transition-colors cursor-pointer relative"
              title={isPlayingAudio ? "Mute Ambient Sound" : "Play Ambient Sound"}
            >
              {isPlayingAudio ? (
                <div className="flex items-end space-x-0.5 h-4 w-4 justify-center">
                  <span className="w-0.5 bg-purple-400 animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-purple-400 animate-[bounce_1s_infinite_300ms] h-2/3" />
                  <span className="w-0.5 bg-purple-400 animate-[bounce_1s_infinite_200ms] h-4/5" />
                </div>
              ) : (
                <VolumeX className="h-4 w-4 opacity-50" />
              )}
            </button>

            {/* Admin Dashboard / Login Link */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="p-2 rounded-full text-purple-400 hover:bg-purple-500/20 transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 rounded-full text-slate-400 hover:text-purple-400 hover:bg-white/5 transition-colors"
                title="Admin Portal Login"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>
            )}

            {/* Admin Logout */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-300 hover:bg-white/5"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden pt-4 mt-3 border-t border-white/10 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive(item.path)
                    ? 'text-white bg-purple-600/30 border border-purple-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-2xl text-sm font-semibold text-purple-400 hover:bg-purple-500/10"
            >
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}
            </Link>

            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-4 py-2.5 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" /> Log Out
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
