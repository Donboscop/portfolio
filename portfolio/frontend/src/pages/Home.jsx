import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Download, Github, Linkedin, Briefcase } from 'lucide-react';
import '../components/CustomAnimation.css';

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden grid-pattern">
      {/* Dynamic colorful decorative backdrop blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl animate-spin-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-pink-500/10 dark:bg-pink-500/15 blur-3xl animate-spin-slow delay-300"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 flex flex-col items-center text-center">
        {/* Profile Image with Gradient Border */}
        <div className="mb-6 relative group animate-fade-in-up">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
            <img
              src="/profile.jpg"
              alt="Don Bosco P"
              className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
            />
          </div>
        </div>



        {/* Hero Title */}
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-tight animate-fade-in-up delay-100">
          Hi, I am <span className="text-gradient">Don Bosco P</span>
        </h1>
        
        {/* Professional Subheading */}
        <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 animate-fade-in-up delay-200">
          Full-Stack MERN Developer
        </p>

        {/* Detailed Pitch */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl animate-fade-in-up delay-200">
          I build premium, production-ready web applications combining clean server logic with modern, responsive, and interactive user experiences.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full animate-fade-in-up delay-300">
          <Link
            to="/projects"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/20 cursor-pointer hover-spring"
          >
            Explore Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3 glass-panel btn-secondary font-semibold rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer hover-spring"
          >
            Get In Touch
          </Link>
          <Link
            to="/resume"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3 border border-slate-300 dark:border-slate-700 btn-secondary font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors cursor-pointer hover-spring"
          >
            <Download className="mr-2 h-4 w-4" />
            Resume
          </Link>
        </div>

        {/* Visual Showcase Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl animate-fade-in-up delay-400">
          <div className="glass-panel p-6 rounded-xl text-center glow-border transition-all duration-300">
            <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">20+</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Projects Completed</p>
          </div>
          <div className="glass-panel p-6 rounded-xl text-center glow-border transition-all duration-300">
            <h3 className="text-3xl font-extrabold text-pink-500">10+</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Happy Recruiters</p>
          </div>
          <div className="glass-panel p-6 rounded-xl text-center glow-border transition-all duration-300">
            <h3 className="text-3xl font-extrabold text-purple-500">15+</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tech Stack Tools</p>
          </div>
          <div className="glass-panel p-6 rounded-xl text-center glow-border transition-all duration-300">
            <h3 className="text-3xl font-extrabold text-teal-500">24/7</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Support & Work</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
