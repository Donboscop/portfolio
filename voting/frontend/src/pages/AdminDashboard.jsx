import React, { useState, useEffect } from 'react';
import { 
  Users, Vote, Award, ShieldCheck, Play, Square, Upload, 
  Trash2, Edit, Plus, X, FileSpreadsheet, Loader2, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'candidates', 'students'
  
  // Election States
  const [election, setElection] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Candidates Management States
  const [candidates, setCandidates] = useState([]);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [cName, setCName] = useState('');
  const [cDept, setCDept] = useState('');
  const [cYear, setCYear] = useState('');
  const [cSymbol, setCSymbol] = useState('🌷');
  const [cImageFile, setCImageFile] = useState(null);
  const [cSymbolFile, setCSymbolFile] = useState(null);

  // Students Management States
  const [students, setStudents] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Student Manual CRUD States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [sCollegeId, setSCollegeId] = useState('');
  const [sName, setSName] = useState('');
  const [sPhoneNumber, setSPhoneNumber] = useState('');
  const [sPassword, setSPassword] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      await fetchElectionAndStats();
      await fetchCandidates();
      await fetchStudents();
    } catch (err) {
      console.error(err);
      setError('Error loading administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchElectionAndStats = async () => {
    const electionRes = await api.get('/election');
    setElection(electionRes.data);
    
    // Stats endpoint is admin only
    const statsRes = await api.get('/election/stats');
    setStats(statsRes.data);
  };

  const fetchCandidates = async () => {
    const res = await api.get('/candidates');
    setCandidates(res.data);
  };

  const fetchStudents = async () => {
    const res = await api.get('/students');
    setStudents(res.data);
  };

  const handleStartElection = async () => {
    if (!window.confirm('WARNING: Starting a new election will delete all current votes, reset candidate counts, and allow students to vote again. Proceed?')) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/election/start');
      setElection(res.data.election);
      setSuccess('Election started successfully! Previous statistics have been reset.');
      await fetchElectionAndStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start election');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopElection = async () => {
    if (!window.confirm('Are you sure you want to stop the current election? Student voting will be immediately disabled.')) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/election/stop');
      setElection(res.data.election);
      setSuccess('Election stopped successfully. Results are now compiled.');
      await fetchElectionAndStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to stop election');
    } finally {
      setActionLoading(false);
    }
  };

  // Candidate Actions
  const handleOpenCandidateModal = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setCName(candidate.name);
      setCDept(candidate.department || '');
      setCYear(candidate.year || '');
      setCSymbol(candidate.symbol || '🌷');
    } else {
      setEditingCandidate(null);
      setCName('');
      setCDept('');
      setCYear('');
      setCSymbol('🌷');
    }
    setCImageFile(null);
    setCSymbolFile(null);
    setShowCandidateModal(true);
  };

  const handleSaveCandidate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', cName);
    formData.append('department', cDept);
    formData.append('year', cYear);
    formData.append('symbol', cSymbol);

    if (cImageFile) {
      formData.append('image', cImageFile);
    }
    if (cSymbolFile) {
      formData.append('symbolImage', cSymbolFile);
    }

    try {
      if (editingCandidate) {
        // Update Candidate
        await api.put(`/candidates/${editingCandidate._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Candidate details updated successfully.');
      } else {
        // Create Candidate
        if (!cImageFile) {
          setError('Candidate photo image is required.');
          setActionLoading(false);
          return;
        }
        await api.post('/candidates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('New Candidate added successfully.');
      }
      setShowCandidateModal(false);
      await fetchCandidates();
      await fetchElectionAndStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing candidate operation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/candidates/${id}`);
      setSuccess('Candidate removed successfully.');
      await fetchCandidates();
      await fetchElectionAndStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting candidate');
    } finally {
      setActionLoading(false);
    }
  };

  // Student Actions
  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return;
    setUploading(true);
    setError('');
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const res = await api.post('/students/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(res.data.statistics);
      setSuccess('Student register uploaded successfully.');
      await fetchStudents();
      await fetchElectionAndStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Error parsing Excel file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student registration?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/students/${id}`);
      setSuccess('Student registration removed successfully.');
      await fetchStudents();
      await fetchElectionAndStats();
    } catch (err) {
      setError('Failed to delete student.');
    }
  };

  // Student Manual CRUD actions
  const handleOpenStudentModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setSCollegeId(student.collegeId);
      setSName(student.name);
      setSPhoneNumber(student.phoneNumber);
      setSPassword('');
    } else {
      setEditingStudent(null);
      setSCollegeId('');
      setSName('');
      setSPhoneNumber('');
      setSPassword('');
    }
    setError('');
    setSuccess('');
    setShowStudentModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      collegeId: sCollegeId,
      name: sName,
      phoneNumber: sPhoneNumber,
      ...(sPassword ? { password: sPassword } : {})
    };

    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, payload);
        setSuccess('Student details updated successfully.');
      } else {
        if (!sPassword) {
          setError('Password is required for manual student registrations.');
          setActionLoading(false);
          return;
        }
        await api.post('/students', payload);
        setSuccess('New student registered successfully.');
      }
      setShowStudentModal(false);
      await fetchStudents();
      await fetchElectionAndStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing student operation');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12">
        <Loader2 size={48} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* Overview Head */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Control Center</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-1 rounded-full border border-emerald-500/20">
              Admin Mode
            </span>
          </h1>
          <p className="text-sm text-white/70 font-medium mt-1">Configure elections, student register spreadsheets, and candidates</p>
        </div>

        {/* Election Status Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {election && election.status === 'active' ? (
            <button
              onClick={handleStopElection}
              disabled={actionLoading}
              className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-red-500/20 transition-all duration-300 text-sm"
            >
              <Square size={16} />
              <span>Stop Election</span>
            </button>
          ) : (
            <button
              onClick={handleStartElection}
              disabled={actionLoading}
              className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-sm"
            >
              <Play size={16} />
              <span>Start Election</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-50/80 border border-rose-200 text-rose-600 text-sm px-5 py-3.5 rounded-2xl font-bold">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-700 text-sm px-5 py-3.5 rounded-2xl font-bold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'overview'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'candidates'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Candidates ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'students'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          Students Registry ({students.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-300 rounded-2xl border border-blue-500/20">
                <Users size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">Total Students</span>
                <span className="text-xl md:text-2xl font-extrabold text-white">{stats.totalStudents}</span>
              </div>
            </div>

            <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/20">
                <Vote size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">Votes Cast</span>
                <span className="text-xl md:text-2xl font-extrabold text-white">{stats.totalVotes}</span>
              </div>
            </div>

            <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-sky-500/20 text-sky-300 rounded-2xl border border-sky-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">Students Voted</span>
                <span className="text-xl md:text-2xl font-extrabold text-white">{stats.studentsVoted}</span>
              </div>
            </div>

            <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-white/10 text-white/70 rounded-2xl border border-white/15">
                <Users size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block">Turnout Ratio</span>
                <span className="text-xl md:text-2xl font-extrabold text-white">{stats.votingPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Winner and Live Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Winner Banner */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-3xl flex flex-col justify-between border-l-4 border-yellow-400 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-white/50 uppercase tracking-wider block">Leading Candidate</span>
                {stats.winner ? (
                  stats.winner.isTie ? (
                    <div>
                      <h3 className="text-2xl font-extrabold text-white">Tied Vote</h3>
                      <p className="text-sm text-white/70 font-semibold mt-1">
                        Multiple candidates hold {stats.winner.voteCount} votes.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-extrabold text-white">{stats.winner.name}</div>
                        <div className="text-2xl">{stats.winner.symbol.length < 3 ? stats.winner.symbol : '🌷'}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-extrabold rounded-lg border border-yellow-500/20">
                        <Award size={14} />
                        <span>Winner Projection ({stats.winner.voteCount} votes)</span>
                      </span>
                    </div>
                  )
                ) : (
                  <h3 className="text-xl font-extrabold text-white/40 animate-pulse">No Votes Logged</h3>
                )}
              </div>

              <div className="bg-white/5 p-4 rounded-2xl text-xs font-semibold text-white/50 leading-relaxed border border-white/5">
                🔒 **Secret Ballot Assurance**: This interface displays aggregate results and winner metrics. The mapping between individual student identifiers and their choices is encrypted in the database and omitted from all query responses.
              </div>
            </div>

            {/* Candidate Vote Share Bars */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
              <h3 className="font-extrabold text-lg text-white">Real-time Vote Count</h3>
              
              {stats.candidates.length === 0 ? (
                <p className="text-white/40 text-sm font-medium">Please add candidates to view vote metrics.</p>
              ) : (
                <div className="space-y-4">
                  {stats.candidates.map((c) => {
                    const pct = stats.totalVotes > 0 ? ((c.voteCount / stats.totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <div key={c._id} className="space-y-1">
                        <div className="flex justify-between text-sm font-bold text-white/80">
                          <span className="flex items-center gap-1.5">
                            <span>{c.name}</span>
                            <span className="text-white/40 font-semibold">({c.symbol.length < 3 ? c.symbol : '🌷'})</span>
                          </span>
                          <span>{c.voteCount} ({pct}%)</span>
                        </div>
                        {/* Custom Bar */}
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-white">Nominated Candidates</h2>
            <button
              onClick={() => handleOpenCandidateModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md"
            >
              <Plus size={16} />
              <span>Add Candidate</span>
            </button>
          </div>

          {candidates.length === 0 ? (
            <div className="glass-panel p-12 text-center text-white/50">
              No candidates registered. Click "Add Candidate" to nominate.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((c) => {
                const isSymbolFile = c.symbol.startsWith('/') || c.symbol.startsWith('http');
                const photoUrl = c.image.startsWith('/') ? `http://localhost:5000${c.image}` : c.image;
                const symbolUrl = isSymbolFile && c.symbol.startsWith('/') ? `http://localhost:5000${c.symbol}` : c.symbol;

                return (
                  <div key={c._id} className="glass-panel rounded-3xl overflow-hidden flex flex-col border border-white/20 shadow-sm relative group">
                    <div className="h-48 w-full bg-white/5 overflow-hidden relative">
                      <img src={photoUrl} alt={c.name} className="w-full h-full object-cover" />
                      
                      {/* Floating actions */}
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <button
                          onClick={() => handleOpenCandidateModal(c)}
                          className="p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md backdrop-blur transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCandidate(c._id)}
                          className="p-2 bg-white/90 hover:bg-white text-rose-600 rounded-xl shadow-md backdrop-blur transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Symbol Overlay */}
                      <div className="absolute bottom-3 right-3 bg-white/95 p-1.5 rounded-xl shadow-md border border-slate-100 flex items-center justify-center min-w-[2.2rem] min-h-[2.2rem]">
                        {isSymbolFile ? (
                          <img src={symbolUrl} alt="Symbol" className="w-5 h-5 object-contain" />
                        ) : (
                          <span className="text-lg">{c.symbol}</span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-grow space-y-3">
                      <div>
                        <h4 className="font-bold text-lg text-white">{c.name}</h4>
                        {(c.department || c.year) && (
                          <p className="text-xs text-white/60 font-semibold mt-1">
                            {c.department} {c.year ? `• Year ${c.year}` : ''}
                          </p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-extrabold text-white/50">
                        <span>VOTES RECORDED:</span>
                        <span className="bg-white/10 text-white px-2 py-0.5 rounded-md">{c.voteCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: STUDENTS */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Left panel: Upload register */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-3xl h-fit space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-400" size={20} />
                <span>Upload Student List</span>
              </h3>
              <p className="text-xs text-white/60 font-medium">Import student rosters using Microsoft Excel formats (.xlsx only)</p>
            </div>

            <form onSubmit={handleExcelUpload} className="space-y-4">
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 transition cursor-pointer relative">
                <input
                  type="file"
                  required
                  accept=".xlsx, .xls"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="text-white/40" size={32} />
                  {excelFile ? (
                    <span className="text-sm font-bold text-white">{excelFile.name}</span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-white/70">Choose file or drag here</span>
                      <span className="text-[10px] text-white/40">Supports .xlsx spreadsheets</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !excelFile}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md transition flex items-center justify-center gap-1.5 ${
                  uploading || !excelFile
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span>Process Excel</span>
                )}
              </button>
            </form>

            {/* Results breakdown */}
            {uploadResult && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 text-xs font-semibold text-white/80">
                <h4 className="font-bold text-white border-b border-white/10 pb-1">Upload Summary</h4>
                <div className="flex justify-between">
                  <span>Parsed Rows:</span>
                  <span>{uploadResult.totalRows}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Registered:</span>
                  <span>+{uploadResult.added}</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span>Details Updated:</span>
                  <span>{uploadResult.updated}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Skipped/Voted:</span>
                  <span>{uploadResult.skipped}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Registered list */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-white">Student Directory</h3>
              <button
                onClick={() => handleOpenStudentModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                <Plus size={14} />
                <span>Add Student</span>
              </button>
            </div>
            
            {students.length === 0 ? (
              <div className="text-center text-white/50 p-12 text-sm">
                No student register has been imported. Use the upload panel to begin.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead>
                    <tr className="text-left text-xs font-extrabold text-white/40 uppercase tracking-wider">
                      <th className="pb-3">College ID / Mobile No</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Voted Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-semibold text-white/90">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-white/5">
                        <td className="py-3.5 font-bold">{student.collegeId}</td>
                        <td className="py-3.5">{student.name}</td>
                        <td className="py-3.5 text-white/60">{student.phoneNumber}</td>
                        <td className="py-3.5">
                          {student.hasVoted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/20">
                              voted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/5 text-white/50 rounded-full text-[10px] font-bold border border-white/5">
                              pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenStudentModal(student)}
                              className="text-blue-400 hover:bg-blue-500/10 p-1.5 rounded-lg transition"
                              title="Edit Student"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition"
                              title="Delete Student"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT CANDIDATE */}
      {showCandidateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-extrabold text-white">
                {editingCandidate ? 'Edit Candidate Profile' : 'Nominate New Candidate'}
              </h3>
              <button
                onClick={() => setShowCandidateModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="e.g., Arun Kumar"
                  className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Department</label>
                  <input
                    type="text"
                    value={cDept}
                    onChange={(e) => setCDept(e.target.value)}
                    placeholder="e.g., EEE"
                    className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Year</label>
                  <input
                    type="text"
                    value={cYear}
                    onChange={(e) => setCYear(e.target.value)}
                    placeholder="e.g., III Year"
                    className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Symbol Picker (Text) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Symbol Emoji (Default)</label>
                  <input
                    type="text"
                    value={cSymbol}
                    onChange={(e) => setCSymbol(e.target.value)}
                    placeholder="e.g., 🌷, 🌟, 🔑"
                    className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm text-center text-lg font-normal"
                  />
                </div>

                {/* Upload Symbol File Option */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Symbol Image File (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCSymbolFile(e.target.files[0])}
                    className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                  />
                </div>
              </div>

              {/* Upload Photo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Candidate Photo Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCImageFile(e.target.files[0])}
                  className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCandidateModal(false)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 border border-white/10 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Save Candidate</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT STUDENT */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-extrabold text-white">
                {editingStudent ? 'Edit Student Registration' : 'Register New Student'}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-5">
              {/* College ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">College ID (Optional, defaults to Mobile No)</label>
                <input
                  type="text"
                  value={sCollegeId}
                  onChange={(e) => setSCollegeId(e.target.value)}
                  placeholder="e.g., 22EEE101"
                  className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Student Name</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">Phone Number</label>
                <input
                  type="text"
                  required
                  value={sPhoneNumber}
                  onChange={(e) => setSPhoneNumber(e.target.value)}
                  placeholder="e.g., 9876543210"
                  className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">
                  {editingStudent ? 'Password (Leave blank to keep unchanged)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingStudent}
                  value={sPassword}
                  onChange={(e) => setSPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input block w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 border border-white/10 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Save Student</span>
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

export default AdminDashboard;
