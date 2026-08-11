import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, AlertTriangle, CheckCircle, Clock, Vote, Check, Loader2 } from 'lucide-react';
import api from '../utils/api';

const StudentDashboard = ({ user, onUserUpdate }) => {
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingFor, setVotingFor] = useState(null); // Candidate to vote for (modal context)
  const [voteLoading, setVoteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Get election state
      const electionRes = await api.get('/election');
      setElection(electionRes.data);

      // Get candidates
      const candidatesRes = await api.get('/candidates');
      setCandidates(candidatesRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (!votingFor) return;
    setVoteLoading(true);
    setError('');
    try {
      const res = await api.post('/votes', { candidateId: votingFor._id });
      setSuccessMsg(res.data.message);
      
      // Update parent user state
      const updatedUser = { ...user, hasVoted: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      
      // Close confirmation modal
      setVotingFor(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit vote. Please try again.');
      setVotingFor(null);
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // Handle Election Ended state
  if (election && election.status === 'ended') {
    return (
      <div className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl glass-panel rounded-3xl p-8 md:p-12 text-center shadow-xl space-y-6">
          <div className="mx-auto inline-flex bg-emerald-500/20 p-5 rounded-3xl text-emerald-400 border border-emerald-500/20">
            <Award size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Election Has Ended</h2>
          <p className="text-white/80 font-medium">
            Voting is now closed. The final results are compiled and ready for viewing.
          </p>
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 hover:shadow-blue-500/20"
          >
            <span>View Election Results</span>
            <Award size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-6xl w-full mx-auto px-6 py-8 md:py-12 space-y-8">
      
      {/* Top Banner Message */}
      {successMsg || user.hasVoted ? (
        <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 border-l-4 border-emerald-500">
          <CheckCircle className="text-emerald-400 shrink-0" size={32} />
          <div className="flex-grow text-center md:text-left">
            <h3 className="font-bold text-lg text-emerald-300">Vote Cast Successfully!</h3>
            <p className="text-sm font-medium text-white/80 mt-1">
              Your ballot has been securely and anonymously registered. Thank you for participating.
            </p>
          </div>
          <button
            onClick={() => navigate('/results')}
            className="px-5 py-2.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold rounded-xl shadow-sm transition-all text-sm shrink-0"
          >
            Check Status
          </button>
        </div>
      ) : election && election.status === 'pending' ? (
        <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 border-l-4 border-amber-500">
          <Clock className="text-amber-400 shrink-0" size={32} />
          <div className="flex-grow text-center md:text-left">
            <h3 className="font-bold text-lg text-amber-300">Election is Pending</h3>
            <p className="text-sm font-medium text-white/80 mt-1">
              The voting portal is currently closed. You can preview the candidates below. Voting will open soon.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 border-l-4 border-blue-500">
          <Vote className="text-blue-400 shrink-0" size={32} />
          <div className="flex-grow text-center md:text-left">
            <h3 className="font-bold text-lg text-blue-300">Voting is Live</h3>
            <p className="text-sm font-medium text-white/80 mt-1">
              Please review the candidates below and cast your vote. You can only vote **once**.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 px-4 py-3 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* Candidates List Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <span>Election Candidates</span>
          <span className="text-sm font-bold bg-white/10 text-white px-3 py-1 rounded-full border border-white/10">
            {candidates.length} Registered
          </span>
        </h2>
        <p className="text-sm text-white/70 font-medium">Review official nominations for this position</p>
      </div>

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-500">
          No candidates have been registered for this election yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => {
            const isSymbolImage = candidate.symbol.startsWith('/') || candidate.symbol.startsWith('http');
            const candidateImageUrl = candidate.image.startsWith('/') 
              ? `http://localhost:5000${candidate.image}` 
              : candidate.image;
            const symbolImageUrl = isSymbolImage && candidate.symbol.startsWith('/')
              ? `http://localhost:5000${candidate.symbol}`
              : candidate.symbol;

            return (
              <div 
                key={candidate._id}
                className="glass-panel rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border border-white/30 group"
              >
                {/* Image Container */}
                <div className="relative h-60 w-full bg-sky-100 overflow-hidden">
                  <img
                    src={candidateImageUrl}
                    alt={candidate.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Symbol Overlay */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur p-2 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center min-w-[3rem] min-h-[3rem]">
                    {isSymbolImage ? (
                      <img src={symbolImageUrl} alt="Symbol" className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-2xl">{candidate.symbol}</span>
                    )}
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-xl text-white tracking-tight">{candidate.name}</h3>
                    {(candidate.department || candidate.year) && (
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        {candidate.department && (
                          <span className="bg-white/10 text-white/90 px-2.5 py-1 rounded-lg">
                            Dept: {candidate.department}
                          </span>
                        )}
                        {candidate.year && (
                          <span className="bg-white/10 text-white/90 px-2.5 py-1 rounded-lg">
                            Year: {candidate.year}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Vote Button */}
                  {election && election.status === 'active' && !user.hasVoted && (
                    <button
                      onClick={() => setVotingFor(candidate)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-2xl shadow-md transition-all duration-300 hover:shadow-blue-500/20"
                    >
                      Vote for Candidate
                    </button>
                  )}

                  {user.hasVoted && (
                    <div className="w-full py-3 bg-white/5 text-white/40 font-bold rounded-2xl flex items-center justify-center gap-1.5 text-sm select-none border border-white/5">
                      <Check size={16} />
                      <span>Voting Complete</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {votingFor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-amber-50 p-4 rounded-3xl text-amber-500 border border-amber-100">
                <AlertTriangle size={36} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Confirm Your Vote</h3>
                <p className="text-sm text-white/70 font-medium">
                  Are you sure you want to vote for <strong className="text-white font-bold">{votingFor.name}</strong>?
                </p>
                <div className="bg-rose-500/20 text-rose-200 border border-rose-500/30 text-xs px-4 py-2.5 rounded-xl font-bold mt-2">
                  ⚠️ This action is final and cannot be reverted.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setVotingFor(null)}
                  disabled={voteLoading}
                  className="flex-1 py-3 border border-white/10 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVoteSubmit}
                  disabled={voteLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  {voteLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Confirm Vote</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
