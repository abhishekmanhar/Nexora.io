import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { ResumePreview } from '../components/resume-templates/ResumePreview';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Trash2, Download, Wand2, X, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Link as LinkIcon, Loader2 } from 'lucide-react';
import { TemplateType } from '../types/resume';
import { optimizeResume, extractResumeFromPortfolio, OptimizationResult } from '../lib/gemini';
import html2pdf from 'html2pdf.js';

export function ResumeBuilder() {
  const { 
    data, 
    template, 
    updatePersonalInfo, 
    addExperience, 
    updateExperience, 
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    addProject,
    updateProject,
    removeProject,
    setTemplate,
    setFullData
  } = useResumeStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiResult, setAiResult] = useState<OptimizationResult | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const steps = ['Template', 'Personal', 'Experience', 'Education', 'Skills & Projects'];

  const handleOptimize = async () => {
    if (!jobDescription) return;
    setIsOptimizing(true);
    setAiResult(null);
    try {
      const result = await optimizeResume(data, jobDescription);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      alert('Failed to optimize resume. Please check your API key and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleImport = async () => {
    if (!portfolioUrl) return;
    setIsImporting(true);
    try {
      const result = await extractResumeFromPortfolio(portfolioUrl);
      setFullData(result);
      setIsImportModalOpen(false);
      setPortfolioUrl('');
    } catch (error) {
      console.error(error);
      alert('Failed to extract data from portfolio. Please check the URL and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const applyOptimizedData = () => {
    if (aiResult?.optimizedData) {
      setFullData(aiResult.optimizedData);
      setIsOptimizeModalOpen(false);
      setJobDescription('');
      setAiResult(null);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;
    
    const opt = {
      margin:       0,
      filename:     `resume_${data.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const templates: { id: TemplateType; name: string }[] = [
    { id: 'ats', name: 'ATS Optimized' },
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-6 rounded-xl border-2 text-sm font-medium transition-all ${
                      template === t.id 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)} className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                <LinkIcon size={16} /> Import from Portfolio
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo({ fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={data.personalInfo.location} onChange={(e) => updatePersonalInfo({ location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={data.personalInfo.website} onChange={(e) => updatePersonalInfo({ website: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea rows={4} value={data.personalInfo.summary} onChange={(e) => updatePersonalInfo({ summary: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Experience</CardTitle>
              <Button variant="outline" size="sm" onClick={addExperience} className="gap-2">
                <Plus size={16} /> Add Role
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="p-4 border border-zinc-200 rounded-lg space-y-4 relative group">
                  <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="checkbox" id={`current-${exp.id}`} checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                          className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-xs font-normal">I currently work here</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={4} value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} placeholder="• Achieved X by doing Y resulting in Z" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation} className="gap-2">
                <Plus size={16} /> Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="p-4 border border-zinc-200 rounded-lg space-y-4 relative group">
                  <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Comma separated list of skills</Label>
                  <Textarea 
                    value={data.skills.join(', ')} 
                    onChange={(e) => updateSkills(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                    placeholder="React, TypeScript, Node.js..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button variant="outline" size="sm" onClick={addProject} className="gap-2">
                  <Plus size={16} /> Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-4 border border-zinc-200 rounded-lg space-y-4 relative group">
                    <Button 
                      variant="ghost" size="icon" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeProject(proj.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Link</Label>
                        <Input value={proj.link} onChange={(e) => updateProject(proj.id, { link: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Technologies (Comma separated)</Label>
                      <Input 
                        value={proj.technologies.join(', ')} 
                        onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea rows={3} value={proj.description} onChange={(e) => updateProject(proj.id, { description: e.target.value })} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-zinc-50 relative">
      {isOptimizeModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4 print:hidden">
          <Card className="w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4 shrink-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <Wand2 className="text-emerald-500" /> AI Resume Optimizer
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOptimizeModalOpen(false)}>
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 overflow-y-auto flex-1">
              {!aiResult ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-600">
                    Paste the job description you are applying for. Our AI will analyze your resume against the requirements, identify missing keywords, and provide actionable suggestions.
                  </p>
                  <Textarea 
                    rows={12} 
                    placeholder="Paste Job Description here..." 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center text-xl font-bold text-emerald-600">
                      {aiResult.score}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg">Match Score</h3>
                      <p className="text-sm text-zinc-600">Based on keyword density and skill alignment.</p>
                    </div>
                  </div>

                  {aiResult.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-500" /> Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-200">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-500" /> Actionable Suggestions
                    </h4>
                    <div className="space-y-3">
                      {aiResult.suggestions.map((sug, i) => (
                        <div key={i} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-sm">
                          <span className="font-semibold text-zinc-900 mr-2">{sug.section}:</span>
                          <span className="text-zinc-600">{sug.recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <div className="p-6 border-t border-zinc-100 flex justify-end gap-2 shrink-0 bg-white rounded-b-xl">
              <Button variant="outline" onClick={() => { setIsOptimizeModalOpen(false); setAiResult(null); }} disabled={isOptimizing}>
                Cancel
              </Button>
              {!aiResult ? (
                <Button onClick={handleOptimize} disabled={isOptimizing || !jobDescription} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  {isOptimizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} /> Analyze & Optimize
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={applyOptimizedData} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 size={16} /> Apply Optimized Data
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Import from Portfolio Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <Card className="w-full max-w-lg shadow-2xl border-0 ring-1 ring-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4 bg-zinc-50/50 rounded-t-xl">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <LinkIcon className="text-emerald-500" size={24} />
                  Import from Portfolio
                </CardTitle>
                <p className="text-sm text-zinc-500">Extract your professional details from a website URL.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsImportModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Portfolio or LinkedIn URL</Label>
                <Input 
                  placeholder="https://your-portfolio.com" 
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
                <p className="text-xs text-zinc-500">
                  Our AI will scan the provided URL and automatically populate your resume with your experience, education, and skills.
                </p>
              </div>
            </CardContent>
            <div className="p-6 border-t border-zinc-100 flex justify-end gap-2 shrink-0 bg-white rounded-b-xl">
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)} disabled={isImporting}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={isImporting || !portfolioUrl} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                {isImporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Extracting...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} /> Import Data
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Left Panel - Form */}
      <div className="w-1/2 h-full flex flex-col border-r border-zinc-200 print:hidden bg-white">
        
        {/* Header & Stepper */}
        <div className="p-6 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Resume Builder</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsOptimizeModalOpen(true)} className="gap-2">
                <Wand2 size={14} /> Optimize
              </Button>
              <Button size="sm" onClick={handlePrint} className="gap-2">
                <Download size={14} /> Export PDF
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep === index 
                      ? 'bg-zinc-900 text-white' 
                      : currentStep > index 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                  }`}
                >
                  {currentStep > index ? <CheckCircle2 size={16} /> : index + 1}
                </button>
                <span className={`text-xs font-medium ${currentStep === index ? 'text-zinc-900' : 'text-zinc-500'}`}>
                  {step}
                </span>
              </div>
            ))}
            <div className="absolute left-4 right-4 top-4 h-0.5 bg-zinc-100 -z-0">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          <div className="max-w-2xl mx-auto pb-8">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-zinc-100 bg-white flex justify-between shrink-0">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <Button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="gap-2"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/2 h-full bg-zinc-200/50 p-8 overflow-y-auto print:w-full print:h-auto print:p-0 print:bg-white">
        <div className="max-w-[850px] mx-auto h-full print:max-w-none">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
