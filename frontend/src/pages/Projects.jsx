import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Github, ExternalLink, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import '../components/CustomAnimation.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [activeTech, setActiveTech] = useState('');

  // List of standard technologies for quick filtering
  const quickFilters = ['React', 'Node', 'Express', 'MongoDB', 'Tailwind', 'TypeScript'];

  useEffect(() => {
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
          throw new Error('Failed to fetch projects');
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

    // Add brief debounce for search input
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, activeTech]);

  const handleTechClick = (tech) => {
    setActiveTech(prev => (prev === tech ? '' : tech));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My <span className="text-gradient">Projects</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Explore my latest developments, open source contributions, and web applications.
        </p>
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
                    : 'glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
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
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
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
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 glow-border hover-spring"
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
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
    </div>
  );
};

export default Projects;
