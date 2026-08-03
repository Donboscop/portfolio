import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Code2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import '../components/CustomAnimation.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          throw new Error('Project details not found');
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 glass-panel rounded-2xl">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Project Not Found</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{error || 'This project might have been removed.'}</p>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Back navigation link */}
      <Link
        to="/projects"
        className="inline-flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Image Slider and Quick Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Display */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-900 relative">
            <div className="h-64 sm:h-96 w-full flex items-center justify-center">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[activeImageIndex]}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=60';
                  }}
                />
              ) : (
                <div className="text-slate-400 dark:text-slate-600 font-semibold">No Image Uploaded</div>
              )}
            </div>
          </div>

          {/* Thumbnails list */}
          {project.images && project.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-blue-600 dark:border-blue-400 scale-95 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=60';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Core Info Panel */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              {project.title}
            </h1>
            
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-lg text-xs font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-350 leading-relaxed">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Project Overview</h3>
              <p className="whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Deep Features, Challenges, and Outcomes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Links Card */}
          <div className="glass-panel p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer hover-spring"
              >
                <Github className="mr-2 h-4 w-4" /> Source Code
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer hover-spring"
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </a>
            )}
          </div>

          {/* Key Features card */}
          {project.features && project.features.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Code2 className="text-blue-600 dark:text-blue-400 mr-2 h-5 w-5" />
                Key Features
              </h3>
              <ul className="space-y-3">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges faced card */}
          {project.challengesFaced && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                <HelpCircle className="text-amber-500 mr-2 h-5 w-5" />
                Challenges Faced
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {project.challengesFaced}
              </p>
            </div>
          )}

          {/* Learning outcomes card */}
          {project.learningOutcomes && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm border-l-4 border-teal-500">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                <ShieldCheck className="text-teal-500 mr-2 h-5 w-5" />
                Learning Outcomes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {project.learningOutcomes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
