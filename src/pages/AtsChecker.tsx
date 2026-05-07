import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ChevronRight, 
  Zap, 
  Target, 
  Layout, 
  Star,
  Loader2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { analyzeResumeWithGemini, AtsAnalysisResult } from '../services/geminiService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import * as pdfjsLib from 'pdfjs-dist';

// PDF worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function AtsChecker() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => 'str' in item ? item.str : '')
        .join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | null = null;
    
    if ('files' in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }

    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const text = await extractTextFromPDF(file);
      if (text.trim().length < 50) {
        throw new Error("Could not extract enough text from the PDF. It might be an image-only file or encrypted.");
      }
      
      setIsAnalyzing(true);
      const analysis = await analyzeResumeWithGemini(text);
      setResult(analysis);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-zinc-200 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              <Zap size={14} fill="currentColor" />
              AI-Powered Scorer
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-zinc-900 mb-6"
          >
            Instant <span className="text-emerald-500">ATS Score</span> Checker
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-600 font-light"
          >
            Upload your resume and see how well it matches modern Applicant Tracking Systems.
            Get detailed feedback on keywords, formatting, and impact.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10">
        {!result && !isUploading && !isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload as any}
              className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-16 text-center hover:border-emerald-500 hover:bg-emerald-50/10 transition-all cursor-pointer group shadow-xl"
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <input 
                id="resume-upload"
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileUpload as any}
              />
              <div className="bg-zinc-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Upload size={32} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Drop your resume here</h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                PDF format recommended. We'll analyze your content and give you a score instantly.
              </p>
              <Button className="h-12 px-8 rounded-full bg-zinc-900 text-white font-bold group-hover:scale-105 transition-transform">
                Choose File
              </Button>
              {error && (
                <div className="mt-8 flex items-center justify-center gap-2 text-red-500 font-medium bg-red-50 p-4 rounded-xl">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {isAnalyzing || isUploading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-20 text-center shadow-xl border border-zinc-200"
                >
                  <div className="flex flex-col items-center gap-6">
                    <Loader2 className="animate-spin text-emerald-500" size={60} />
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900">Analyzing your resume...</h3>
                      <p className="text-zinc-500 mt-2">Checking keywords, formatting, and impact metrics with AI.</p>
                    </div>
                  </div>
                </motion.div>
              ) : result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Results Header Card */}
                  <Card className="p-10 border-none shadow-2xl bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                      <div className="relative">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-zinc-100"
                          />
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={552.92}
                            initial={{ strokeDashoffset: 552.92 }}
                            animate={{ strokeDashoffset: 552.92 - (552.92 * result.score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-emerald-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-zinc-900">{result.score}</span>
                          <span className="text-zinc-400 font-bold text-xs tracking-widest uppercase">Score</span>
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-black text-zinc-900 mb-4">Your ATS Report</h2>
                        <p className="text-zinc-600 leading-relaxed text-lg font-light mb-6">
                          "{result.summary}"
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <Button 
                            onClick={() => setResult(null)} 
                            variant="outline" 
                            className="rounded-full gap-2 border-zinc-200"
                          >
                            <RefreshCw size={16} /> Re-scan
                          </Button>
                          <Button className="rounded-full gap-2 bg-zinc-900 text-white">
                            Get Career Coaching <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-zinc-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <Target size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Keywords</div>
                          <div className="text-xl font-bold text-zinc-900">{result.keywordMatch}/30</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Layout size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Formatting</div>
                          <div className="text-xl font-bold text-zinc-900">{result.formattingScore}/20</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <Star size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Impact</div>
                          <div className="text-xl font-bold text-zinc-900">{result.impactScore}/30</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Detailed Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Keywords Section */}
                    <Card className="p-8 border-none shadow-xl bg-white overflow-hidden">
                      <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2">
                        <Search size={24} className="text-emerald-500" /> Technical Fit
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <div className="text-xs font-bold text-zinc-400 uppercase mb-3 pr-4 border-l-2 border-emerald-500 pl-3">Found Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {result.foundKeywords.map((k, i) => (
                              <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-400 uppercase mb-3 border-l-2 border-red-500 pl-3">Missing Critical Keywords</div>
                          <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.map((k, i) => (
                              <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Recommendations Section */}
                    <Card className="p-8 border-none shadow-xl bg-white overflow-hidden">
                      <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2">
                        <Zap size={24} className="text-orange-500" /> Action Steps
                      </h3>
                      <div className="space-y-4">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                              {i + 1}
                            </div>
                            <p className="text-zinc-600 text-[14px] font-medium leading-normal py-1 border-b border-zinc-50 group-last:border-none pb-3">
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Formatting Warnings */}
                  {result.formattingIssues.length > 0 && (
                    <Card className="p-8 border-none shadow-xl bg-white overflow-hidden border-l-4 border-amber-500">
                      <h3 className="text-xl font-black text-zinc-900 mb-4 flex items-center gap-2">
                        <AlertCircle size={24} className="text-amber-500" /> Formatting Warnings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.formattingIssues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-3 text-zinc-600 text-sm font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
