import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download, Mail, Sparkles, Terminal, Code2, Database, ShieldCheck, Server } from 'lucide-react';
import AnimeWrapper from '../components/AnimeWrapper';
import IconsaxIcon from '../components/IconsaxIcon';
import '../components/CustomAnimation.css';

const Home = () => {
  return (
    <div className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center overflow-hidden">
      {/* Background Animated Motion SVGs (Jitter / SVGator Inspired) */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-35 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="180" stroke="url(#paint0_linear)" strokeWidth="2" strokeDasharray="8 8" className="animate-spin-slow" />
          <circle cx="800" cy="700" r="250" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeDasharray="12 12" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="550" y1="450" x2="1050" y2="950" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Category Sub-Headline Badge */}
        <AnimeWrapper animationType="fadeUp" delay={100}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-purple-500/20 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-wider text-purple-600 dark:text-purple-300 uppercase">
              FULL-STACK DEVELOPER & AWS CLOUD PRACTITIONER
            </span>
          </div>
        </AnimeWrapper>

        {/* Hero Main Grid - Editorial Asymmetric Fluid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Typography Header */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <AnimeWrapper animationType="fadeUp" delay={200}>
              <h1 className="fluid-heading-xl tracking-tight text-slate-900 dark:text-white">
                Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500">scalable full-stack applications</span> with cloud-ready architectures.
              </h1>
            </AnimeWrapper>

            <AnimeWrapper animationType="fadeUp" delay={300}>
              <p className="text-lg sm:text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Hi, I'm <strong className="text-purple-600 dark:text-purple-400 font-bold">Don Bosco P</strong>. I craft high-performance web applications using the MERN stack and build secure, cloud-ready infrastructure on AWS.
              </p>
            </AnimeWrapper>

            {/* Action Buttons */}
            <AnimeWrapper animationType="fadeUp" delay={400}>
              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link
                  to="/projects"
                  className="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base flex items-center space-x-3 transition-all duration-300 shadow-lg shadow-purple-600/30 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explore Portfolio</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-2xl glass-panel text-slate-900 dark:text-white font-bold text-base flex items-center space-x-2 hover:bg-purple-500/10 border border-slate-200/50 dark:border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span>Get In Touch</span>
                </Link>

                <Link
                  to="/resume"
                  className="px-6 py-4 rounded-2xl border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-base flex items-center space-x-2 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </Link>
              </div>
            </AnimeWrapper>
          </div>

          {/* Right Column: Floating Visual Card Spotlight */}
          <div className="lg:col-span-4 relative">
            <AnimeWrapper animationType="float" delay={500}>
              <div className="glass-panel p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/40 transition-all duration-500"></div>

                {/* Developer Avatar Badge */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-6 border-2 border-purple-500/30 shadow-md">
                  <img
                    src="/profile.jpg"
                    alt="Don Bosco P"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <IconsaxIcon name="terminal" size={22} />
                    <span className="font-bold text-slate-900 dark:text-white text-lg">MERN & AWS Engineer</span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Designing resilient full-stack applications with MongoDB, PostgreSQL, and AWS cloud management.
                  </p>

                  <div className="pt-4 border-t border-slate-200/50 dark:border-white/10 flex flex-wrap gap-2">
                    {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AWS Cloud', 'Java'].map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimeWrapper>
          </div>
        </div>

        {/* Highlight Badges / Stats Grid */}
        <AnimeWrapper animationType="staggerChildren" delay={600} stagger={120} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <IconsaxIcon name="code" size={24} className="mb-3" />
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">20+</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">DEPLOYED PROJECTS & LABS</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <IconsaxIcon name="database" size={24} className="mb-3" />
            <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">MERN Stack</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">FULL-STACK ARCHITECTURE</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <IconsaxIcon name="server" size={24} className="mb-3" />
            <h3 className="text-3xl font-extrabold text-pink-500">AWS Certified</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CLOUD PRACTITIONER</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <IconsaxIcon name="layers" size={24} className="mb-3" />
            <h3 className="text-3xl font-extrabold text-indigo-500">Cloud Ready</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">DEVOPS & LINUX SKILLS</p>
          </div>
        </AnimeWrapper>
      </div>
    </div>
  );
};

export default Home;
