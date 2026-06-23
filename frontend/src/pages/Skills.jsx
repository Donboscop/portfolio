import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as Icons from 'lucide-react';
import '../components/CustomAnimation.css';

const Skills = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    level: 80,
    category: 'frontend'
  });

  const categories = [
    { id: 'all', label: 'All Skills', icon: Icons.Star },
    { id: 'frontend', label: 'Frontend', icon: Icons.Layout },
    { id: 'backend', label: 'Backend', icon: Icons.Server },
    { id: 'database', label: 'Database', icon: Icons.Database },
    { id: 'devops', label: 'DevOps & Tools', icon: Icons.Settings }
  ];

  // Fetch skills from API
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      // Small visual delay for shimmer effect
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'level' ? Math.min(100, Math.max(0, parseInt(value) || 0)) : value 
    }));
  };

  const startAddSkill = () => {
    setEditingSkill(null);
    setForm({
      name: '',
      level: 80,
      category: 'frontend'
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const startEditSkill = (skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      level: skill.level,
      category: skill.category
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.level === undefined || !form.category) {
      setFormError('Please fill out all fields.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const url = editingSkill ? `/api/skills/${editingSkill._id}` : '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save skill');
      }

      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const res = await authFetch(`/api/skills/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSkills(prev => prev.filter(s => s._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete skill');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting');
    }
  };

  const getSkillIcon = (name, category) => {
    const nameLower = (name || '').toLowerCase();
    
    if (nameLower.includes('react')) return Icons.Atom;
    if (nameLower.includes('javascript') || nameLower.includes('js')) return Icons.Code2;
    if (nameLower.includes('html') || nameLower.includes('css')) return Icons.Globe;
    if (nameLower.includes('tailwind')) return Icons.Wind;
    if (nameLower.includes('redux')) return Icons.Boxes;
    if (nameLower.includes('typescript') || nameLower.includes('ts')) return Icons.Shield;
    if (nameLower.includes('node')) return Icons.Cpu;
    if (nameLower.includes('express')) return Icons.Zap;
    if (nameLower.includes('java')) return Icons.Coffee;
    if (nameLower.includes('api') || nameLower.includes('rest')) return Icons.Terminal;
    if (nameLower.includes('auth') || nameLower.includes('jwt') || nameLower.includes('shield')) return Icons.Shield;
    if (nameLower.includes('graphql')) return Icons.Boxes;
    if (nameLower.includes('mongo') || nameLower.includes('mongoose')) return Icons.Database;
    if (nameLower.includes('sql') || nameLower.includes('mysql') || nameLower.includes('postgres')) return Icons.Database;
    if (nameLower.includes('redis')) return Icons.Database;
    if (nameLower.includes('git') || nameLower.includes('github')) return Icons.GitBranch;
    if (nameLower.includes('docker')) return Icons.Boxes;
    if (nameLower.includes('vite') || nameLower.includes('webpack') || nameLower.includes('setting')) return Icons.Settings;
    if (nameLower.includes('aws') || nameLower.includes('cloud') || nameLower.includes('ec2') || nameLower.includes('s3')) return Icons.Cloud;
    if (nameLower.includes('postman')) return Icons.Terminal;
    
    // Category fallbacks
    switch (category) {
      case 'frontend': return Icons.Layout;
      case 'backend': return Icons.Server;
      case 'database': return Icons.Database;
      case 'devops': return Icons.Settings;
      default: return Icons.Star;
    }
  };

  const getSkillColors = (category) => {
    switch (category) {
      case 'frontend':
        return { color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', barColor: 'bg-cyan-500' };
      case 'backend':
        return { color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', barColor: 'bg-emerald-500' };
      case 'database':
        return { color: 'text-blue-600', bgColor: 'bg-blue-600/10', barColor: 'bg-blue-600' };
      case 'devops':
        return { color: 'text-purple-500', bgColor: 'bg-purple-500/10', barColor: 'bg-purple-500' };
      default:
        return { color: 'text-slate-500', bgColor: 'bg-slate-500/10', barColor: 'bg-slate-500' };
    }
  };

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const SkillSkeleton = () => (
    <div className="glass-panel p-6 rounded-xl shadow-sm border border-slate-200/20 dark:border-slate-800/20 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-28 skeleton-shimmer rounded" />
        </div>
        <div className="h-4 w-8 skeleton-shimmer rounded" />
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full w-1/2 skeleton-shimmer rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Technical <span className="text-gradient">Skills</span>
        </h2>
        <p className="mt-4 text-lg text-slate-650 dark:text-slate-400">
          My toolbox: the programming languages, database systems, libraries, and hosting environments I use.
        </p>
        
        {/* Admin Add Button */}
        {isAuthenticated && (
          <div className="mt-6 flex justify-center animate-fade-in-up">
            <button
              onClick={startAddSkill}
              className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md hover-spring cursor-pointer"
            >
              <Icons.Plus className="mr-2 h-4 w-4" /> Add Skill
            </button>
          </div>
        )}
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

      {/* Skills Progress Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <SkillSkeleton />
          <SkillSkeleton />
          <SkillSkeleton />
          <SkillSkeleton />
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-2xl max-w-4xl mx-auto">
          <p className="text-slate-500 dark:text-slate-400">No skills added in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredSkills.map((skill) => {
            const SkillIcon = getSkillIcon(skill.name, skill.category);
            const style = getSkillColors(skill.category);
            return (
              <div
                key={skill._id}
                className="glass-panel p-6 rounded-xl shadow-sm glow-border transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-lg ${style.bgColor} ${style.color}`}>
                        <SkillIcon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md">
                        {skill.level}%
                      </span>
                      {isAuthenticated && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditSkill(skill)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                            title="Edit skill"
                          >
                            <Icons.Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                            title="Delete skill"
                          >
                            <Icons.Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${style.barColor} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-modal-backdrop">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-modal-content border border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <Icons.X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Icons.Sparkles className="text-blue-600 dark:text-blue-400 mr-2 h-5 w-5" />
              {editingSkill ? 'Edit Skill Record' : 'Add Skill to Portfolio'}
            </h3>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-semibold text-red-700 dark:text-red-400 animate-fade-in-up">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. React.js, Docker, Java"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="devops">DevOps & Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Level (0 - 100%)
                  </label>
                  <input
                    type="number"
                    name="level"
                    required
                    min="0"
                    max="100"
                    value={form.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 justify-end border-t border-slate-100 dark:border-slate-900/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-650 dark:text-slate-350 font-semibold hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
                >
                  {formSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Icons.Save className="mr-1.5 h-4 w-4" /> Save Skill
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
