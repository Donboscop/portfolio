import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Github, ExternalLink, ArrowRight, BookOpen, AlertCircle, Plus, Edit2, Trash2, X, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../components/CustomAnimation.css';

const Projects = () => {
  const { isAuthenticated, authFetch } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [activeTech, setActiveTech] = useState('');

  // Modal and form states for inline editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null means adding a new project
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

  // List of standard technologies for quick filtering
  const quickFilters = ['React', 'Node', 'Express', 'MongoDB', 'Tailwind', 'TypeScript'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = '/api/projects';
      const params = [];
      
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }
      if (activeTech) {
        params.push(`tech=${encodeURIComponent(activeTech)}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch projects');
      }
      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add brief debounce for search input
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, activeTech]);

  const handleTechClick = (tech) => {
    setActiveTech(prev => (prev === tech ? '' : tech));
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
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  // Form input changes handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  // Files change handler
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Remove existing image locally in form state
  const handleRemoveExistingImage = (idx) => {
    setProjectForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== idx)
    }));
  };

  // Form submit handler
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
        body: formData // Note: Content-Type header is omitted so boundary is automatically set
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save project. Verify details.');
      }

      setIsModalOpen(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My <span className="text-gradient">Projects</span>
        </h2>
        <p className="mt-4 text-lg text-slate-650 dark:text-slate-400">
          Explore my latest developments, open source contributions, and web applications.
        </p>

        {/* Admin Add Button */}
        {isAuthenticated && (
          <div className="mt-6 flex justify-center animate-fade-in-up">
            <button
              onClick={startAddProject}
              className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md hover-spring cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="max-w-4xl mx-auto mb-10 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all text-slate-950 dark:text-white"
          />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-2">Filter by Tech:</span>
          {quickFilters.map(tech => {
            const isSelected = activeTech.toLowerCase() === tech.toLowerCase();
            return (
              <button
                key={tech}
                onClick={() => handleTechClick(tech)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm shadow-blue-500/20'
                    : 'glass-panel text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {tech}
              </button>
            );
          })}
          {activeTech && (
            <button
              onClick={() => setActiveTech('')}
              className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel p-6 rounded-2xl h-80 animate-pulse flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-12 glass-panel max-w-lg mx-auto rounded-2xl">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Projects</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-12 glass-panel max-w-lg mx-auto rounded-2xl">
          <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Projects Found</h3>
          <p className="text-sm text-slate-650 dark:text-slate-400 mb-6">
            We couldn't find any projects matching your search criteria.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Login to Admin Dashboard to add some
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div
              key={project._id}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 glow-border hover-spring relative"
            >
              <div>
                {/* Project Image Panel */}
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                      No Image Available
                    </div>
                  )}

                  {/* Float Edit & Delete badges for Admin */}
                  {isAuthenticated && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          startEditProject(project);
                        }}
                        className="p-2 bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-450 hover:bg-white dark:hover:bg-slate-900 rounded-lg shadow-sm cursor-pointer transition-all"
                        title="Edit project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProject(project._id);
                        }}
                        className="p-2 bg-white/90 dark:bg-slate-900/90 text-red-650 dark:text-red-405 hover:bg-white dark:hover:bg-slate-955 rounded-lg shadow-sm cursor-pointer transition-all"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Floating Tech Badges */}
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-slate-950/70 text-white rounded text-[10px] font-semibold uppercase tracking-wider backdrop-blur-[2px]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-950/70 text-white rounded text-[10px] font-semibold backdrop-blur-[2px]">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-650 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-900/50 flex items-center justify-between">
                <div className="flex space-x-3">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Live Deployment"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <Link
                  to={`/project/${project._id}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-modal-backdrop">
          <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 sm:p-8 relative shadow-2xl animate-modal-content border border-slate-200/50 dark:border-slate-800/50 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Sparkles className="text-blue-600 dark:text-blue-400 mr-2 h-5 w-5" />
              {editingProject ? 'Edit Project Record' : 'Add Project to Portfolio'}
            </h3>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-semibold text-red-700 dark:text-red-400 animate-fade-in-up">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Live Deployment Link</label>
                  <input
                    type="url"
                    name="liveLink"
                    value={projectForm.liveLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Learning Outcomes</label>
                  <textarea
                    name="learningOutcomes"
                    rows="3"
                    value={projectForm.learningOutcomes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none"
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
                      <div key={idx} className="relative w-24 h-16 border border-slate-200 dark:border-slate-800 rounded overflow-hidden bg-slate-50">
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
                  onClick={() => setIsModalOpen(false)}
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
        </div>
      )}
    </div>
  );
};

export default Projects;
