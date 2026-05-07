import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

export function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="font-serif text-zinc-900 w-full break-words">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-3 overflow-hidden">
          {personalInfo.fullName}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-800 font-medium">
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-zinc-600" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1 underline decoration-zinc-300 underline-offset-2">
              <Mail size={12} className="text-zinc-600" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={12} className="text-blue-600" /> LinkedIn
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe size={12} className="text-zinc-600" /> Portfolio
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-zinc-600" /> {personalInfo.location}
            </span>
          )}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-800 pb-0.5 mb-2">Professional Summary</h2>
          <p className="text-[12px] leading-relaxed text-zinc-800 text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-800 pb-0.5 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-sm text-zinc-900">{exp.company}</h3>
                  <span className="text-[11px] font-bold text-zinc-900">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[12px] italic text-zinc-700">{exp.position}</div>
                  {personalInfo.location && <div className="text-[11px] text-zinc-500 italic">Remote, {personalInfo.location}</div>}
                </div>
                <div className="text-[11px] text-zinc-800 space-y-1">
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{line.replace(/^•\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-800 pb-0.5 mb-3">Personal Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[12px] text-zinc-900">
                    {proj.name} — <span className="font-normal italic text-zinc-600">{proj.technologies.join(', ')}</span>
                  </h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 underline font-medium">
                      View Project
                    </a>
                  )}
                </div>
                <div className="text-[11px] text-zinc-800 space-y-1">
                  {proj.description.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{line.replace(/^•\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-800 pb-0.5 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[12px] text-zinc-900">{edu.institution}</h3>
                  <div className="text-[11px] text-zinc-700">{edu.degree} in {edu.fieldOfStudy}</div>
                </div>
                <span className="text-[11px] font-medium text-zinc-800">
                  {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-800 pb-0.5 mb-2">Technical Skills</h2>
          <p className="text-[11px] text-zinc-800 leading-relaxed font-medium">
            <span className="font-bold">Skills: </span> {skills.join(' • ')}
          </p>
        </section>
      )}
    </div>
  );
}
