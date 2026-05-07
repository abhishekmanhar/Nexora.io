import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, Sparkles, Plus, X, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';
import { GoogleGenAI } from '@google/genai';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  logo: string;
  postedBy: string;
  createdAt: any;
  source?: string;
  applyUrl?: string;
}

export function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [googleJobs, setGoogleJobs] = useState<Job[]>([]);
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [googleSearchError, setGoogleSearchError] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { role, user } = useAuthStore();
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: doc.data().source || 'Nexora'
      })) as Job[];
      setJobs(jobsData);
    }, (error) => {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Initial fetch for jobs on mount
    handleSearchGoogle('Data Engineer');
  }, []);

  useEffect(() => {
    // Debounced search when searchTerm or filterLocation changes
    if (!searchTerm && !filterLocation) return;
    
    const delayDebounceFn = setTimeout(() => {
      handleSearchGoogle(searchTerm);
    }, 800); // 800ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterLocation]);

  const allJobs = [...jobs, ...googleJobs];
  // Deduplicate by ID and ensure we don't have empty IDs
  const uniqueJobs = Array.from(new Map(
    allJobs
      .filter(job => job && job.id)
      .map(job => [job.id, job])
  ).values());

  const filteredJobs = uniqueJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || job.type === filterType;
    const matchesSource = filterSource === 'All' || job.source === filterSource;
    const matchesLocation = filterLocation === 'All' || filterLocation.trim() === '' || 
                            job.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesSource && matchesLocation;
  });

  const handleSearchGoogle = async (queryOverride?: string) => {
    setIsSearchingGoogle(true);
    setGoogleSearchError(null);
    try {
      const q = queryOverride !== undefined ? queryOverride : (searchTerm || 'Software Engineer');
      if (!q && !filterLocation) {
        setIsSearchingGoogle(false);
        return;
      }

      const loc = (filterLocation && filterLocation !== 'All' && filterLocation !== 'Remote') ? filterLocation : '';
      const res = await fetch(`/api/jobs?q=${encodeURIComponent(q)}${loc ? `&location=${encodeURIComponent(loc)}` : ''}`);
      
      let data: any;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('Failed to parse response from server.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to the Google Jobs API.');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.jobs && data.jobs.length > 0) {
        const newJobs = data.jobs.map((j: any, index: number) => ({
          id: j.job_id || j.id || j.id_v2 || `rapid-${Math.random().toString(36).substring(2, 9)}-${index}`,
          title: j.title || j.job_title || j.role || 'Unknown Role',
          company: j.company || j.company_name || j.employer_name || j.organization || 'Unknown Company',
          location: j.location || j.job_location || j.candidate_required_location || 'Remote',
          type: j.type || j.job_type || j.employment_type || 'Full-time',
          salary: j.salary || j.salary_range || j.job_salary || 'Not specified',
          tags: Array.isArray(j.tags) ? j.tags : (j.industry ? [j.industry] : (j.job_category ? [j.job_category] : ['Web'])),
          logo: j.logo || j.company_logo || j.employer_logo || (j.company || j.company_name || 'J').charAt(0).toUpperCase(),
          postedBy: 'api',
          createdAt: j.date_posted || j.posted_at || new Date().toISOString(),
          source: 'Active Jobs DB',
          applyUrl: j.redirect_url || j.job_apply_link || j.job_url || j.url || j.apply_url || j.link
        }));
        setGoogleJobs(newJobs);
      } else {
        setGoogleSearchError("No jobs found via Active Jobs DB for this query.");
        setGoogleJobs([]);
      }
    } catch (error: any) {
      console.error('Error fetching Google Jobs:', error);
      setGoogleSearchError(error.message || "An unexpected error occurred while searching for jobs.");
    } finally {
      setIsSearchingGoogle(false);
    }
  };

  const handleGetInsights = async (company: string, jobId: string) => {
    if (insights[jobId] || loadingInsights[jobId]) return;
    
    setLoadingInsights(prev => ({ ...prev, [jobId]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me a 2-sentence quick insight about the company ${company} and what it's like to work there.`,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      setInsights(prev => ({ ...prev, [jobId]: response.text || 'No insights available.' }));
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights(prev => ({ ...prev, [jobId]: 'Failed to load insights.' }));
    } finally {
      setLoadingInsights(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-12 px-6 selection:bg-emerald-500/30 relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header & Search */}
        <div className="text-center space-y-6 mb-16 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-emerald-600 text-sm font-medium mb-4 shadow-sm"
          >
            <Sparkles size={16} />
            <span>Nexora.io Job Board</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900"
          >
            Find your next <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">dream job</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 max-w-2xl mx-auto font-light"
          >
            Discover opportunities from Active Jobs DB and Nexora.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 max-w-3xl mx-auto mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <Input 
                placeholder="Search by role, company, or skills..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-full focus-visible:ring-emerald-500 shadow-sm text-lg"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant={showFilters ? "default" : "outline"} 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-14 px-6 rounded-full shadow-sm ${showFilters ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900'}`}
              >
                <Filter size={20} className="mr-2" /> Filters
              </Button>
              <Button 
                onClick={handleSearchGoogle} 
                disabled={isSearchingGoogle}
                className="h-14 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold"
              >
                {isSearchingGoogle ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Search size={20} className="mr-2" />}
                Explore Jobs
              </Button>
              {(role === 'recruiter' || role === 'admin') && (
                <Button onClick={() => setIsPostModalOpen(true)} className="h-14 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm font-bold">
                  <Plus size={20} className="mr-2" /> Post Job
                </Button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Job Type</label>
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="All">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Location</label>
                    <Input 
                      placeholder="e.g. Remote, Austin..."
                      value={filterLocation === 'All' ? '' : filterLocation} 
                      onChange={(e) => setFilterLocation(e.target.value || 'All')}
                      className="w-full h-10 px-3 rounded-lg bg-zinc-50 border-zinc-200 text-zinc-900 text-sm focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Source</label>
                    <select 
                      value={filterSource} 
                      onChange={(e) => setFilterSource(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="All">All Sources</option>
                      <option value="Nexora">Nexora</option>
                      <option value="Active Jobs DB">Active Jobs DB</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Job Listings */}
        <div className="space-y-4">
          <AnimatePresence>
            {googleSearchError && (
              <motion.div 
                key="google-search-error"
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-4"
              >
                {googleSearchError}
              </motion.div>
            )}
            
            {filteredJobs.length === 0 ? (
              <motion.div 
                key="no-jobs-found"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-20 text-zinc-500"
              >
                No jobs found. Try adjusting your search or filters.
              </motion.div>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id || `job-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group bg-white border-zinc-200 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-900 shadow-sm shrink-0 overflow-hidden">
                          {job.logo && job.logo.startsWith('http') ? (
                            <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                          ) : (
                            job.logo
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider w-fit">
                                {job.type}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider w-fit flex items-center gap-1">
                                <Globe size={12} /> {job.source}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-medium">
                            <span className="flex items-center gap-1.5 text-zinc-700">
                              <Briefcase size={16} className="text-zinc-400" /> {job.company}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={16} className="text-zinc-400" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <DollarSign size={16} className="text-zinc-400" /> {job.salary}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={16} className="text-zinc-400" /> 
                              {job.createdAt?.toDate ? new Date(job.createdAt.toDate()).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {Array.from(new Set((job.tags || []).map(t => String(t).trim()).filter(Boolean))).map((tag, tIdx) => (
                              <span key={`${job.id}-tag-${tag}-${tIdx}`} className="px-3 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* AI Insights Section */}
                          <div className="pt-4">
                            {!insights[job.id] && !loadingInsights[job.id] ? (
                              <button 
                                onClick={() => handleGetInsights(job.company, job.id)}
                                className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                              >
                                <Sparkles size={14} /> Get AI Company Insights
                              </button>
                            ) : loadingInsights[job.id] ? (
                              <div className="text-xs flex items-center gap-2 text-zinc-500">
                                <Loader2 size={14} className="animate-spin" /> Analyzing company...
                              </div>
                            ) : (
                              <div className="text-sm bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-emerald-800 flex items-start gap-2">
                                <Sparkles size={16} className="shrink-0 mt-0.5" />
                                <p>{insights[job.id]}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                          {job.applyUrl ? (
                            <a 
                              href={job.applyUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none"
                            >
                              <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-bold shadow-sm">
                                Apply Now
                              </Button>
                            </a>
                          ) : (
                            <Button className="flex-1 sm:flex-none bg-zinc-300 text-zinc-500 cursor-not-allowed rounded-full font-bold shadow-sm" disabled>
                              Apply Now
                            </Button>
                          )}
                          <Button variant="outline" className="flex-1 sm:flex-none border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 rounded-full shadow-sm">
                            Save
                          </Button>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <PostJobModal onClose={() => setIsPostModalOpen(false)} user={user} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PostJobModal({ onClose, user }: { onClose: () => void, user: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    tags: '',
    logo: '',
    applyUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        logo: formData.logo || formData.company.charAt(0).toUpperCase(),
        postedBy: user.uid,
        source: 'Nexora',
        createdAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to post job. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-zinc-200 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Post a New Job</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Job Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-zinc-50 border-zinc-200 text-zinc-900" placeholder="e.g. Senior React Developer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Company</label>
              <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="bg-zinc-50 border-zinc-200 text-zinc-900" placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Location</label>
              <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-zinc-50 border-zinc-200 text-zinc-900" placeholder="e.g. Remote, NY" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Job Type</label>
              <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-10 px-3 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Salary Range</label>
              <Input required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="bg-zinc-50 border-zinc-200 text-zinc-900" placeholder="e.g. $120k - $150k" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Tags (comma separated)</label>
            <Input required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-zinc-50 border-zinc-200 text-zinc-900" placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Application Link (URL)</label>
            <Input value={formData.applyUrl} onChange={e => setFormData({...formData, applyUrl: e.target.value})} className="bg-zinc-50 border-zinc-200 text-zinc-900" placeholder="https://company.com/careers/job" />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl mt-4">
            {loading ? <Loader2 className="animate-spin" /> : 'Post Job'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
