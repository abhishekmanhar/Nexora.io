import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Sparkles, FileText, Briefcase, Zap, Target, Users, Search } from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-emerald-500/30 overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20">
        <motion.div style={{ y, opacity }} className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-emerald-600 text-sm font-medium shadow-sm"
          >
            <Sparkles size={16} />
            <span>The Future of Hiring is Here</span>
          </motion.div>
          
          <h1 className="text-[12vw] sm:text-[8vw] md:text-[6vw] font-black tracking-tighter leading-[0.85] text-zinc-900">
            Build your career. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600">
              Faster than ever.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-600 max-w-2xl mx-auto font-light leading-relaxed">
            Nexora.io combines an intelligent job board with an AI-driven resume builder. 
            Optimize your profile, match with top companies, and get hired.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/jobs">
              <Button size="lg" className="h-14 px-8 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-zinc-900/20">
                Explore Jobs <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/resume">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-lg transition-transform hover:scale-105 active:scale-95 shadow-sm">
                Build Resume
              </Button>
            </Link>
            <Link to="/ats-checker">
              <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-emerald-600 font-bold text-lg hover:bg-emerald-50 transition-colors">
                Check ATS Score 🚀
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Infinite Marquee */}
      <div className="relative z-10 py-10 border-y border-zinc-200 bg-white/50 backdrop-blur-sm overflow-hidden flex">
        <motion.div 
          animate={{ x: [0, -1035] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap items-center gap-12 text-zinc-400 font-bold text-xl uppercase tracking-widest"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={i}>
              <span>AI Resume Builder</span>
              <span className="text-emerald-500">•</span>
              <span>Smart Job Matching</span>
              <span className="text-blue-500">•</span>
              <span>One-Click Apply</span>
              <span className="text-emerald-500">•</span>
              <span>ATS Dashboard</span>
              <span className="text-blue-500">•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Bento Grid Features */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-900">Everything you need to <br/><span className="text-emerald-500">succeed.</span></h2>
            <p className="text-zinc-600 text-lg max-w-2xl mx-auto">A complete ecosystem for candidates and recruiters, designed for speed and precision.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {/* Feature 1 - Large */}
          <FadeIn delay={0.1} className="md:col-span-2 relative group rounded-3xl bg-white border border-zinc-200 overflow-hidden hover:border-emerald-500/50 transition-colors shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <FileText size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-zinc-900">AI Resume Builder</h3>
                <p className="text-zinc-600 text-lg leading-relaxed max-w-md">
                  Create stunning resumes in minutes. Our AI analyzes job descriptions and optimizes your content to beat ATS systems and stand out to recruiters.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Feature 2 - Tall */}
          <FadeIn delay={0.2} className="relative group rounded-3xl bg-white border border-zinc-200 overflow-hidden hover:border-blue-500/50 transition-colors shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <Target size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900">Smart Matching</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Find roles that perfectly align with your skills. Advanced filtering and personalized recommendations delivered daily.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Feature 3 */}
          <FadeIn delay={0.3} className="relative group rounded-3xl bg-white border border-zinc-200 overflow-hidden hover:border-purple-500/50 transition-colors shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900">One-Click Apply</h3>
                <p className="text-zinc-600 text-sm">Stop filling out endless forms. Use your Nexora profile to apply instantly.</p>
              </div>
            </div>
          </FadeIn>

          {/* Feature 4 */}
          <FadeIn delay={0.4} className="relative group rounded-3xl bg-white border border-zinc-200 overflow-hidden hover:border-emerald-500/50 transition-colors shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900">ATS Checker</h3>
                <p className="text-zinc-600 text-sm">Upload your existing resume and get an instant compatibility score with expert feedback.</p>
              </div>
            </div>
          </FadeIn>

          {/* Feature 5 */}
          <FadeIn delay={0.5} className="relative group rounded-3xl bg-white border border-zinc-200 overflow-hidden hover:border-rose-500/50 transition-colors shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900">Talent Pool</h3>
                <p className="text-zinc-600 text-sm">Access a curated network of pre-vetted professionals ready for their next role.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Big CTA Section */}
      <section className="relative z-10 py-32 px-6 border-t border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-[10vw] sm:text-[8vw] font-black tracking-tighter leading-none mb-10 text-zinc-900">
              Ready to <br/><span className="text-emerald-500">start?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/jobs">
                <Button size="lg" className="h-16 px-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                  Find a Job
                </Button>
              </Link>
              <Link to="/recruiter">
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xl transition-transform hover:scale-105 active:scale-95 shadow-sm">
                  Hire Talent
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-zinc-200 text-center text-zinc-500 text-sm bg-zinc-50">
        <p>© 2026 Nexora.io. All rights reserved.</p>
      </footer>
    </div>
  );
}
