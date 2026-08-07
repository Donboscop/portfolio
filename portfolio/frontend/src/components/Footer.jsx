import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Eye, ShieldCheck } from 'lucide-react';
import IconsaxIcon from './IconsaxIcon';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setVisitorCount(data.count);
        }
      } catch (err) {
        console.error('Failed to load visitor statistics:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <footer className="border-t border-slate-200/50 dark:border-white/10 glass-panel backdrop-blur-xl py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        {/* Brand & Copy */}
        <div className="flex items-center space-x-3">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Don Bosco P Portfolio. Powered by PostgreSQL & AWS.
          </p>
        </div>

        {/* Visitor Counter Badge */}
        {visitorCount !== null && (
          <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-300 shadow-sm">
            <Eye className="h-3.5 w-3.5 text-purple-500 animate-pulse" />
            <span>Visitors: {visitorCount.toLocaleString()}</span>
          </div>
        )}

        {/* Social Links & Admin Entry */}
        <div className="flex items-center space-x-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </a>

          <a
            href="https://www.linkedin.com/in/don-bosco-29a4b52aa/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>

          <a
            href="mailto:donboscop24@gmail.com"
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label="Email Address"
          >
            <Mail className="h-5 w-5" />
          </a>

          {/* Direct Admin Login Entry */}
          <Link
            to="/admin"
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-transparent hover:border-purple-500/20"
            title="Admin Login Portal"
          >
            <ShieldCheck className="h-4 w-4 text-purple-500" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
