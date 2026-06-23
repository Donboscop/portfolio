import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Award, 
  Code, 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save 
} from 'lucide-react';
import '../components/CustomAnimation.css';

const About = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const [form, setForm] = useState({
    year: '',
    title: '',
    company: '',
    description: ''
  });

  // Fetch milestones from API
  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      // Small visual delay for shimmer skeleton
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const startAddMilestone = () => {
    setEditingMilestone(null);
    setForm({
      year: '',
      title: '',
      company: '',
      description: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const startEditMilestone = (ms) => {
    setEditingMilestone(ms);
    setForm({
      year: ms.year,
      title: ms.title,
      company: ms.company,
      description: ms.description
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.year || !form.title || !form.company || !form.description) {
      setFormError('Please fill out all fields.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const url = editingMilestone ? `/api/milestones/${editingMilestone._id}` : '/api/milestones';
      const method = editingMilestone ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save milestone');
      }

      setIsModalOpen(false);
      fetchMilestones();
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journey milestone?')) return;

    try {
      const res = await authFetch(`/api/milestones/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMilestones(prev => prev.filter(m => m._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete milestone');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting');
    }
  };

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
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <Calendar className="text-blue-600 dark:text-blue-400 mr-2 h-6 w-6" />
                Timeline & Journey
              </h3>
              
              {/* Add Milestone Trigger */}
              {isAuthenticated && (
                <button
                  onClick={startAddMilestone}
                  className="flex items-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm hover-spring cursor-pointer animate-fade-in-up"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Milestone
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : milestones.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-6">No milestones added yet.</p>
            ) : (
              <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 space-y-8">
                {milestones.map((item) => (
                  <div key={item._id} className="relative group">
                    {/* Timeline point indicator */}
                    <span className="absolute -left-[31px] top-1.5 bg-blue-600 dark:bg-blue-400 w-3 h-3 rounded-full border-4 border-white dark:border-slate-900 ring-4 ring-blue-50 dark:ring-blue-950/40"></span>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {item.year}
                      </span>
                      
                      {/* Admin CRUD controls */}
                      {isAuthenticated && (
                        <div className="flex space-x-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditMilestone(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-955/20 rounded cursor-pointer"
                            title="Edit milestone"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 rounded cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h4>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {item.company}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-modal-backdrop">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-modal-content border border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Award className="text-blue-600 dark:text-blue-400 mr-2 h-5 w-5" />
              {editingMilestone ? 'Edit Journey Milestone' : 'Add Journey Milestone'}
            </h3>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-semibold text-red-700 dark:text-red-400 animate-fade-in-up">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Year/Duration
                  </label>
                  <input
                    type="text"
                    name="year"
                    required
                    value={form.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 2022 - 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Company/Institution
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={form.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Anna University"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Milestone Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Web Development Intern"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Summarize the achievements, GPA, or activities..."
                />
              </div>

              <div className="flex gap-4 pt-4 justify-end border-t border-slate-100 dark:border-slate-900/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-650 dark:text-slate-350 font-semibold hover:bg-slate-55/50 dark:hover:bg-slate-950/40 cursor-pointer"
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
                      <Save className="mr-1.5 h-4 w-4" /> Save Milestone
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

export default About;
