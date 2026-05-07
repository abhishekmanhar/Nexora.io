import React from 'react';
import { ResumeData } from '../../types/resume';

export function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="font-sans text-zinc-900 w-full flex gap-8 break-words h-full">
      {/* Sidebar */}
      <div className="w-1/3 bg-zinc-900 text-white p-6 rounded-l-2xl shrink-0 overflow-hidden">
        <h1 className="text-3xl font-black tracking-tighter mb-8 leading-none text-emerald-400 break-words">
          {personalInfo.fullName.split(' ').map((n, i) => <div key={i}>{n}</div>)}
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Contact</h2>
            <div className="text-sm space-y-1 text-zinc-300">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
            </div>
          </div>

          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-zinc-100 text-sm">{edu.degree}</h3>
                    <div className="text-xs text-zinc-400">{edu.institution}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 py-8 pr-8">
        {personalInfo.summary && (
          <section className="mb-10">
            <h2 className="text-2xl font-black tracking-tight mb-4 text-zinc-900">About Me</h2>
            <p className="text-sm leading-relaxed text-zinc-600">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-black tracking-tight mb-6 text-zinc-900">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-emerald-400">
                  <div className="absolute w-3 h-3 bg-emerald-400 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                  <h3 className="font-bold text-lg text-zinc-900">{exp.position}</h3>
                  <div className="text-sm font-medium text-emerald-600 mb-1">{exp.company}</div>
                  <div className="text-xs text-zinc-400 font-medium mb-3">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <p className="text-sm text-zinc-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-6 text-zinc-900">Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <h3 className="font-bold text-zinc-900 mb-1">{proj.name}</h3>
                  <p className="text-sm text-zinc-600 mb-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies.map((tech, i) => (
                      <span key={i} className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
