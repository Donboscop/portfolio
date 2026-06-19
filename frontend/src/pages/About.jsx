import React from 'react';
import { Calendar, Award, Code, BookOpen, ChevronRight } from 'lucide-react';
import '../components/CustomAnimation.css';

const About = () => {
  const milestones = [
    {
      year: 'July 2025',
      title: 'Web Development Trainee',
      company: 'ILINKS Infotech',
      description: 'Gained hands-on experience in responsive web development, interactive UI design, frontend debugging, and real-time project implementation.'
    },
    {
      year: 'June 2025',
      title: 'Full Stack Masterclass Trainee',
      company: 'NoviTech R&D Private Limited',
      description: 'Built dynamic full-stack web applications with REST API integration, responsive UI components, and database connectivity.'
    },
    {
      year: '2024 (2 Months)',
      title: 'Web Development Intern',
      company: 'EdiGlobe',
      description: 'Developed responsive and user-friendly web pages using HTML, CSS, JavaScript, and Bootstrap, while improving frontend performance.'
    },
    {
      year: '2022 - 2026',
      title: 'B.Tech in Information Technology',
      company: 'UCE (BIT Campus), Anna University',
      description: 'Pursuing degree with focus on database systems, data structures, and web technologies. Cumulative GPA: 7.75/10.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About <span className="text-gradient">Me</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Learn about my journey, credentials, and what drives my passion for web development.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Profile Card & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl shadow-sm flex flex-col items-center text-center glow-border">
            <div className="relative group mb-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-48 h-56 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md">
                <img
                  src="/profile.jpg"
                  alt="Don Bosco P"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Don Bosco P</h3>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">Full-Stack MERN Developer</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Specializing in high-performance web software.</p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="glass-panel p-5 rounded-xl flex items-center space-x-4 glow-border">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Continuous Learner</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Always mastering new tech</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl flex items-center space-x-4 glow-border">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/50 rounded-lg text-pink-600 dark:text-pink-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Detail-Oriented</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Committed to clean code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Story & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Story Section */}
          <div className="glass-panel p-8 rounded-2xl shadow-sm glow-border">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Code className="text-blue-600 dark:text-blue-400 mr-2 h-6 w-6" />
              My Professional Story
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              <p>
                Hello! My name is Don Bosco P, and I am an aspiring Full Stack Web Developer specializing in the MERN stack (MongoDB, Express.js, React.js, Node.js).
              </p>
              <p>
                I am currently pursuing my Bachelor of Technology in Information Technology at UCE (BIT Campus), Anna University in Tiruchirappalli. During my studies, I fell in love with full-stack development, finding joy in translating complex code logic into responsive, interactive user experiences.
              </p>
              <p>
                Through my hands-on internships at EdiGlobe, NoviTech, and ILINKS, I have built practical experience implementing REST APIs, engineering robust backend databases, and developing clean frontends using JavaScript and modern styling libraries. I am eager to join a dynamic development team where I can apply my problem-solving skills and grow professionally.
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="glass-panel p-8 rounded-2xl shadow-sm glow-border">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
              <Calendar className="text-blue-600 dark:text-blue-400 mr-2 h-6 w-6" />
              Timeline & Journey
            </h3>
            
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 space-y-8">
              {milestones.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point indicator */}
                  <span className="absolute -left-[31px] top-1.5 bg-blue-600 dark:bg-blue-400 w-3 h-3 rounded-full border-4 border-white dark:border-slate-900 ring-4 ring-blue-50 dark:ring-blue-950/40"></span>
                  
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h4>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {item.company}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
