import React, { useState } from 'react';
import { 
  Layout, 
  Server, 
  Database, 
  Settings, 
  Star, 
  Atom, 
  Code2, 
  Globe, 
  Wind, 
  Boxes, 
  Shield, 
  Cpu, 
  Zap, 
  Coffee, 
  Terminal, 
  GitBranch, 
  Cloud 
} from 'lucide-react';
import '../components/CustomAnimation.css';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Skills', icon: Star },
    { id: 'frontend', label: 'Frontend', icon: Layout },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'devops', label: 'DevOps & Tools', icon: Settings }
  ];

  const skillData = [
    // Frontend
    { name: 'React.js', level: 90, category: 'frontend', icon: Atom, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', barColor: 'bg-cyan-500' },
    { name: 'JavaScript (ES6+)', level: 95, category: 'frontend', icon: Code2, color: 'text-amber-500', bgColor: 'bg-amber-500/10', barColor: 'bg-amber-500' },
    { name: 'HTML5 / CSS3', level: 95, category: 'frontend', icon: Globe, color: 'text-orange-500', bgColor: 'bg-orange-500/10', barColor: 'bg-orange-500' },
    { name: 'Tailwind CSS', level: 90, category: 'frontend', icon: Wind, color: 'text-sky-400', bgColor: 'bg-sky-400/10', barColor: 'bg-sky-400' },
    { name: 'Redux Toolkit', level: 80, category: 'frontend', icon: Boxes, color: 'text-violet-500', bgColor: 'bg-violet-500/10', barColor: 'bg-violet-500' },
    { name: 'TypeScript', level: 85, category: 'frontend', icon: Shield, color: 'text-blue-500', bgColor: 'bg-blue-500/10', barColor: 'bg-blue-500' },
    // Backend
    { name: 'Node.js', level: 85, category: 'backend', icon: Cpu, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', barColor: 'bg-emerald-500' },
    { name: 'Express.js', level: 90, category: 'backend', icon: Zap, color: 'text-gray-500', bgColor: 'bg-gray-500/10', barColor: 'bg-gray-500' },
    { name: 'Java (OOP)', level: 80, category: 'backend', icon: Coffee, color: 'text-red-500', bgColor: 'bg-red-500/10', barColor: 'bg-red-500' },
    { name: 'REST APIs', level: 95, category: 'backend', icon: Terminal, color: 'text-teal-500', bgColor: 'bg-teal-500/10', barColor: 'bg-teal-500' },
    { name: 'JWT Authentication', level: 90, category: 'backend', icon: Shield, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', barColor: 'bg-indigo-500' },
    { name: 'GraphQL', level: 70, category: 'backend', icon: Boxes, color: 'text-pink-500', bgColor: 'bg-pink-500/10', barColor: 'bg-pink-500' },
    // Database
    { name: 'MongoDB / Mongoose', level: 88, category: 'database', icon: Database, color: 'text-green-600', bgColor: 'bg-green-600/10', barColor: 'bg-green-600' },
    { name: 'MySQL', level: 75, category: 'database', icon: Database, color: 'text-blue-600', bgColor: 'bg-blue-600/10', barColor: 'bg-blue-600' },
    { name: 'PostgreSQL', level: 80, category: 'database', icon: Database, color: 'text-sky-600', bgColor: 'bg-sky-600/10', barColor: 'bg-sky-600' },
    { name: 'Redis', level: 65, category: 'database', icon: Database, color: 'text-rose-600', bgColor: 'bg-rose-600/10', barColor: 'bg-rose-600' },
    // DevOps / Tools
    { name: 'Git / GitHub', level: 92, category: 'devops', icon: GitBranch, color: 'text-orange-600', bgColor: 'bg-orange-600/10', barColor: 'bg-orange-600' },
    { name: 'Docker', level: 75, category: 'devops', icon: Boxes, color: 'text-blue-500', bgColor: 'bg-blue-500/10', barColor: 'bg-blue-500' },
    { name: 'Vite / Webpack', level: 85, category: 'devops', icon: Settings, color: 'text-purple-500', bgColor: 'bg-purple-500/10', barColor: 'bg-purple-500' },
    { name: 'AWS (S3, EC2)', level: 70, category: 'devops', icon: Cloud, color: 'text-orange-400', bgColor: 'bg-orange-400/10', barColor: 'bg-orange-400' },
    { name: 'Postman', level: 90, category: 'devops', icon: Terminal, color: 'text-orange-500', bgColor: 'bg-orange-500/10', barColor: 'bg-orange-500' }
  ];

  const filteredSkills = activeCategory === 'all'
    ? skillData
    : skillData.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Technical <span className="text-gradient">Skills</span>
        </h2>
        <p className="mt-4 text-lg text-slate-605 dark:text-slate-400">
          My toolbox: the programming languages, database systems, libraries, and hosting environments I use.
        </p>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Progress Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {filteredSkills.map((skill, index) => {
          const SkillIcon = skill.icon;
          return (
            <div
              key={skill.name}
              className="glass-panel p-6 rounded-xl shadow-sm glow-border transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px]"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg ${skill.bgColor} ${skill.color}`}>
                    <SkillIcon className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md">
                  {skill.level}%
                </span>
              </div>
              
              {/* Custom Interactive Progress Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${skill.barColor} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
