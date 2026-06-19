import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, Eye } from 'lucide-react';

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
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        {/* Copy text */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} MERN Developer Portfolio. All rights reserved.
        </p>

        {/* Visitor counter badge with animations */}
        {visitorCount !== null && (
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-sm animate-pulse">
            <Eye className="h-4 w-4" />
            <span>Visitors: {visitorCount.toLocaleString()}</span>
          </div>
        )}

        {/* Social Icons */}
        <div className="flex space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/don-bosco-29a4b52aa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            aria-label="Twitter Profile"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="mailto:donboscop24@gmail.com"
            className="text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Email Address"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
