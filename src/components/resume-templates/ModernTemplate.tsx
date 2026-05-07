import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="font-sans text-zinc-900 w-full break-words">
      {/* Header */}
      <header className="border-b-2 border-zinc-900 pb-6 mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2 truncate">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
          {personalInfo.email && <div className="flex items-center gap-1"><Mail size={14} /> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={14} /> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-1"><MapPin size={14} /> {personalInfo.location}</div>}
          {personalInfo.website && <div className="flex items-center gap-1"><Globe size={14} /> {personalInfo.website}</div>}
          {personalInfo.linkedin && <div className="flex items-center gap-1"><Linkedin size={14} /> {personalInfo.linkedin}</div>}
          {personalInfo.github && <div className="flex items-center gap-1"><Github size={14} /> {personalInfo.github}</div>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-zinc-200 pb-2 mb-4">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-zinc-900">{exp.position}</h3>
                      <span className="text-xs text-zinc-500 font-medium">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-zinc-700 mb-2">{exp.company}</div>
                    <p className="text-sm text-zinc-600 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-zinc-200 pb-2 mb-4">Projects</h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-zinc-900">{proj.name}</h3>
                      {proj.link && <a href={`https://${proj.link}`} className="text-xs text-blue-600 hover:underline">{proj.link}</a>}
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.technologies.map((tech, i) => (
                          <span key={i} className="text-xs bg-zinc-100 px-2 py-1 rounded-md text-zinc-700">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-zinc-200 pb-2 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-sm bg-zinc-900 text-white px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-zinc-200 pb-2 mb-4">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-zinc-900 text-sm">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <div className="text-sm text-zinc-700">{edu.institution}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
