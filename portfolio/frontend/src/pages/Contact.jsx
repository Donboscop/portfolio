import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import '../components/CustomAnimation.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact <span className="text-gradient">Me</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Got a project idea, job opportunity, or just want to say hello? Drop a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
        
        {/* Left: Contact Info Info Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              I am open to discuss custom software development, full-time engineering placements, or contract consulting.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">donboscop24@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-650 dark:text-pink-405 rounded-xl">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Call</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">+91 8220754727</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-405 rounded-xl">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Office Location</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Tiruchirappalli, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form Panel */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send Message</h3>

            {/* Success Notification */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center space-x-3 text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-semibold">Message sent successfully! I will get back to you soon.</span>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Hiring Inquiry, Project Collaboration"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Message</label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-6 py-3.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-750 text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer hover-spring disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Subtle Admin Login Link */}
      <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 text-center animate-fade-in-up">
        <Link
          to="/admin/login"
          className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer hover-spring"
        >
          <Lock className="h-3 w-3 mr-1.5" />
          Admin Portal Login
        </Link>
      </div>
    </div>
  );
};

export default Contact;
