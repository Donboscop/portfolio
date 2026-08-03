import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  MessageSquare,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FileDown,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Award
} from 'lucide-react';
import '../components/CustomAnimation.css';

const AdminDashboard = () => {
  const { authFetch } = useAuth();
  
  // Dashboard navigation tab state
  const [activeTab, setActiveTab] = useState('projects');
  
  // Projects data & UI states
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null means adding a new project
  
  // Project form fields
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
    features: '',
    challengesFaced: '',
    learningOutcomes: '',
    existingImages: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Messages data states
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Analytics states
  const [stats, setStats] = useState({
    visitorCount: 0,
    projectCount: 0,
    messageCount: 0
  });
  const [certCount, setCertCount] = useState(0);

  // Fetch initial data
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        // Update local stats preview
        setStats(prev => ({ ...prev, projectCount: data.length }));
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await authFetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setStats(prev => ({ ...prev, messageCount: data.length }));
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchVisitorStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({ ...prev, visitorCount: data.count }));
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const fetchCertCount = async () => {
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) {
        const data = await res.json();
        setCertCount(data.length);
      }
    } catch (err) {
      console.error('Error loading cert count:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMessages();
    fetchVisitorStats();
    fetchCertCount();
  }, []);

  // Handle Tab switches
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'projects') fetchProjects();
    if (tab === 'messages') fetchMessages();
    if (tab === 'analytics') {
      fetchProjects();
      fetchMessages();
      fetchVisitorStats();
      fetchCertCount();
    }
  };

  // Setup form for editing
  const startEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      technologies: proj.technologies ? proj.technologies.join(', ') : '',
      githubLink: proj.githubLink || '',
      liveLink: proj.liveLink || '',
      features: proj.features ? proj.features.join(', ') : '',
      challengesFaced: proj.challengesFaced || '',
      learningOutcomes: proj.learningOutcomes || '',
      existingImages: proj.images || []
    });
    setSelectedFiles([]);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Setup form for creating
  const startAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      githubLink: '',
      liveLink: '',
      features: '',
      challengesFaced: '',
      learningOutcomes: '',
      existingImages: []
    });
    setSelectedFiles([]);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (idx) => {
    setProjectForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== idx)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    // Construct FormData for multipart images support
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('technologies', projectForm.technologies);
    formData.append('githubLink', projectForm.githubLink);
    formData.append('liveLink', projectForm.liveLink);
    formData.append('features', projectForm.features);
    formData.append('challengesFaced', projectForm.challengesFaced);
    formData.append('learningOutcomes', projectForm.learningOutcomes);
    
    // Append existing images that weren't deleted
    projectForm.existingImages.forEach(img => {
      formData.append('existingImages', img);
    });

    // Append new uploaded files
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: formData // Note: Content-Type header is omitted so the browser automatically sets the boundary
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save project. Verify details.');
      }

      setIsFormOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete project trigger
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;

    try {
      const res = await authFetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Delete Message trigger
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await authFetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchMessages();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete message');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard title banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <Sparkles className="text-blue-600 dark:text-blue-400 mr-2 h-6 w-6" />
            Admin Control Center
          </h2>
          <p className="mt-1 text-slate-550 dark:text-slate-400 text-sm">
            Maintain project assets, read incoming messages, and audit visitor analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/certifications"
            className="flex items-center px-4 py-2 border border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/25 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300 hover-spring cursor-pointer animate-fade-in-up"
          >
            <Award className="mr-1.5 h-4 w-4" /> Manage Certifications
          </Link>
        </div>
      </div>

      {/* Main dashboard tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
        <button
          onClick={() => handleTabChange('projects')}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'projects'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          <span>Projects</span>
        </button>
        <button
          onClick={() => handleTabChange('messages')}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Messages</span>
        </button>
        <button
          onClick={() => handleTabChange('analytics')}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </button>
      </div>

      {/* TAB PANEL CONTENT */}
      
      {/* 1. PROJECTS TAB PANEL */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio Projects</h3>
            <button
              onClick={startAddProject}
              className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm hover-spring cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add Project
            </button>
          </div>

          {/* Inline Form View */}
          {isFormOpen && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-blue-500/20 relative animate-fade-in-up">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
              </h4>

              {formError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-semibold text-red-700 dark:text-red-400">
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Form fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Project Name</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={projectForm.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Technologies Used (Comma-separated)</label>
                    <input
                      type="text"
                      name="technologies"
                      placeholder="e.g. React, Node.js, Express, MongoDB"
                      value={projectForm.technologies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Short Description</label>
                  <textarea
                    name="description"
                    required
                    rows="3"
                    value={projectForm.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">GitHub Repository Link</label>
                    <input
                      type="url"
                      name="githubLink"
                      value={projectForm.githubLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Live Deployment Link</label>
                    <input
                      type="url"
                      name="liveLink"
                      value={projectForm.liveLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Key Features (Comma-separated)</label>
                  <textarea
                    name="features"
                    rows="2"
                    placeholder="e.g. JWT Auth integration, Dark mode support, Responsive panels"
                    value={projectForm.features}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Challenges Faced</label>
                    <textarea
                      name="challengesFaced"
                      rows="3"
                      value={projectForm.challengesFaced}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Learning Outcomes</label>
                    <textarea
                      name="learningOutcomes"
                      rows="3"
                      value={projectForm.learningOutcomes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm"
                    ></textarea>
                  </div>
                </div>

                {/* Upload Image management */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Project Screenshot Images</label>
                  
                  {/* Current images checklist with delete buttons */}
                  {projectForm.existingImages && projectForm.existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {projectForm.existingImages.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-16 border rounded overflow-hidden bg-slate-50">
                          <img src={img} className="w-full h-full object-cover" alt="existing screenshot" />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-650 text-white rounded-full p-1 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multer Local File Upload input */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-550 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950/40 dark:file:text-blue-400 file:cursor-pointer"
                  />
                  <p className="text-[10px] font-medium text-slate-450 mt-2">
                    Supports JPG, PNG, WEBP. Max size 5MB. You can select up to 5 files at once.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-4 justify-end border-t border-slate-100 dark:border-slate-900/50">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-650 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
                  >
                    {formSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-4 w-4" /> Save Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grid or Table listing projects */}
          {loadingProjects ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-2xl">
              <p className="text-slate-500 dark:text-slate-400">No projects added yet. Click "Add Project" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj._id} className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all glow-border">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-2">
                      {proj.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-450 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-900/50">
                    <button
                      onClick={() => startEditProject(proj)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-md cursor-pointer"
                      title="Edit details"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj._id)}
                      className="p-2 text-red-650 dark:text-red-405 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MESSAGES TAB PANEL */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Submissions</h3>
          
          {loadingMessages ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-2xl">
              <p className="text-slate-500 dark:text-slate-400">No contact messages received yet.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="glass-panel p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 hover:shadow-md transition-all animate-fade-in-up"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                      <span className="text-xs text-slate-400">&lt;{msg.email}&gt;</span>
                    </div>
                    
                    <div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                        Subject: {msg.subject}
                      </span>
                    </div>

                    <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="flex items-center text-[10px] text-slate-400 font-semibold gap-1.5 pt-2">
                      <Calendar className="h-3 w-3" />
                      <span>Received: {new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="self-end sm:self-start p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md flex-shrink-0 cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ANALYTICS TAB PANEL */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in-up">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio Analytics</h3>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl">
            {/* Visitors Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitor Count</span>
                <h4 className="text-3xl font-extrabold text-blue-650 dark:text-blue-400 mt-2">
                  {stats.visitorCount.toLocaleString()}
                </h4>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
                <Eye className="h-6 w-6" />
              </div>
            </div>

            {/* Total Projects Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Projects</span>
                <h4 className="text-3xl font-extrabold text-pink-655 mt-2">
                  {stats.projectCount}
                </h4>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-950/40 text-pink-600 rounded-2xl">
                <Layers className="h-6 w-6" />
              </div>
            </div>

            {/* Total Certifications Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications</span>
                <h4 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                  {certCount}
                </h4>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Award className="h-6 w-6" />
              </div>
            </div>

            {/* Total Messages Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Messages Received</span>
                <h4 className="text-3xl font-extrabold text-purple-655 mt-2">
                  {stats.messageCount}
                </h4>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-2xl">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* General instructions card */}
          <div className="glass-panel p-6 rounded-2xl max-w-4xl border-l-4 border-blue-500">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
              Quick Setup Tips
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-500 dark:text-slate-400 mt-3 space-y-2 leading-relaxed">
              <li>Changes to the projects section reflect globally on the public landing sections instantly.</li>
              <li>You can check new form inquiries by clicking on the Messages tab periodically.</li>
              <li>To add, modify, or remove credentials/certificates, navigate to the public <Link to="/certifications" className="text-blue-605 dark:text-blue-400 hover:underline">Certifications Page</Link> where editing privileges are unlocked for you.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
