import React, { useState, useEffect } from 'react';
import { Award, AlertTriangle, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Results = ({ user }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/election/results');
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Election results are not available yet. Results will be published after the election ends.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // If there is an error (e.g. election has not ended yet and user is student)
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl glass-panel rounded-3xl p-8 md:p-12 text-center shadow-xl space-y-6">
          <div className="mx-auto inline-flex bg-amber-500/20 p-5 rounded-3xl text-amber-400 border border-amber-500/20 animate-bounce">
            <ClockIcon />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Results Pending</h2>
          <p className="text-white/80 font-semibold leading-relaxed">
            The election is currently live or in preparation. Voting data is encrypted and sealed. 
            Official results will automatically unlock here as soon as the election ends.
          </p>
          <div className="bg-white/5 p-4 rounded-2xl text-xs font-semibold text-white/50 border border-white/5">
            Current Status: **Active Voting Window Open**
          </div>
        </div>
      </div>
    );
  }

  const { title, candidates, winner, totalVotes } = results;

  return (
    <div className="flex-grow max-w-5xl w-full mx-auto px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{title}</h1>
        <p className="text-sm font-bold bg-blue-500/20 text-blue-200 border border-blue-500/20 px-3.5 py-1 rounded-full inline-block">
          Official Certified Results
        </p>
      </div>

      {/* Winner Display */}
      {winner ? (
        winner.isTie ? (
          <div className="glass-panel rounded-3xl p-8 md:p-12 text-center border-l-8 border-yellow-400 shadow-lg space-y-4">
            <Award className="text-yellow-400 mx-auto" size={48} />
            <h2 className="text-2xl font-extrabold text-white">Election Result: Tie</h2>
            <p className="text-white/80 font-semibold max-w-lg mx-auto">
              There is a tie for the leading candidate position. The top nominees received {winner.voteCount} votes each.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {winner.candidates.map((c, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl text-sm border border-white/10">
                  {c.name} {c.symbol}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-8 md:p-12 text-center border-l-8 border-emerald-500 shadow-lg relative overflow-hidden flex flex-col items-center">
            {/* Sparkle background elements */}
            <div className="absolute top-10 left-10 w-8 h-8 text-yellow-300 opacity-40 select-none animate-pulse">✨</div>
            <div className="absolute bottom-10 right-10 w-8 h-8 text-yellow-300 opacity-40 select-none animate-pulse">✨</div>

            <Award className="text-emerald-400 mb-4 animate-bounce" size={56} />
            
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-1">Declared Winner</span>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-200 to-emerald-200 bg-clip-text text-transparent tracking-tight">
              {winner.name}
            </h2>
            
            {/* Winner Details */}
            <div className="mt-6 flex flex-col md:flex-row items-center gap-6 bg-white/10 p-5 rounded-3xl border border-white/10 shadow-sm max-w-md w-full justify-center">
              <img 
                src={winner.image.startsWith('/') ? `http://localhost:5000${winner.image}` : winner.image} 
                alt={winner.name} 
                className="w-24 h-24 rounded-2xl object-cover shadow-md border border-white/10"
              />
              <div className="text-center md:text-left space-y-1">
                <span className="text-2xl block">{winner.symbol.length < 3 ? winner.symbol : '🌷'}</span>
                <span className="font-bold text-white text-lg block">{winner.name}</span>
                {winner.department && (
                  <span className="text-xs text-white/70 font-bold block">{winner.department} • {winner.year}</span>
                )}
                <span className="text-xs text-blue-200 font-extrabold bg-blue-500/20 border border-blue-500/25 px-2.5 py-0.5 rounded-md inline-block mt-1">
                  {winner.voteCount} Votes Cast
                </span>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 font-semibold">
          No votes were cast in this election.
        </div>
      )}

      {/* Breakdown List */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <h3 className="text-xl font-extrabold text-white">Outcome Details</h3>
        
        <div className="divide-y divide-white/10">
          {candidates.map((c, index) => {
            const isWinner = winner && !winner.isTie && winner._id === c._id;
            const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
            const photoUrl = c.image.startsWith('/') ? `http://localhost:5000${c.image}` : c.image;

            return (
              <div key={c._id} className="py-4 flex items-center justify-between gap-4 font-semibold text-white/95">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-white/40 w-6">#{index + 1}</span>
                  <img src={photoUrl} alt={c.name} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-white/10" />
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {isWinner && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/25">
                          Winner
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-white/50 font-semibold mt-0.5">
                      {c.symbol.length < 3 ? c.symbol : '🌷'} • {c.department || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-bold text-white">{c.voteCount} Votes</span>
                  <span className="block text-xs text-white/40">{pct}% Share</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Badge / Security Info */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 border-l-4 border-blue-500 bg-blue-500/5 border border-white/10">
        <ShieldCheck className="text-blue-400 shrink-0" size={32} />
        <div className="text-center md:text-left space-y-1">
          <h4 className="font-bold text-blue-200">Cryptographically Audited & Validated</h4>
          <p className="text-xs text-white/60 font-semibold leading-relaxed">
            This election result is final, sealed, and audited. Every vote was validated for college eligibility, 
            protecting student anonymity while guaranteeing that exactly one vote was recorded per voter.
          </p>
        </div>
      </div>

    </div>
  );
};

// Clock Helper Icon
const ClockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Results;
