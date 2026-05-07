import React from 'react';
import { ResumeData } from '../../types/resume';

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="font-mono text-zinc-800 w-full text-sm break-words">
      <header className="mb-12">
        <h1 className="text-2xl font-bold mb-4 overflow-hidden">{personalInfo.fullName}</h1>
        <div className="flex flex-col gap-1 text-zinc-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-12">
          <h2 className="text-zinc-400 uppercase tracking-widest mb-4 text-xs">Summary</h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-zinc-400 uppercase tracking-widest mb-6 text-xs">Experience</h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-zinc-500">
                  {exp.startDate} —<br />{exp.current ? 'Present' : exp.endDate}
                </div>
                <div className="col-span-3">
                  <h3 className="font-bold text-zinc-900">{exp.position}</h3>
                  <div className="text-zinc-600 mb-2">{exp.company}</div>
                  <p className="whitespace-pre-line text-zinc-700">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-zinc-400 uppercase tracking-widest mb-6 text-xs">Education</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-zinc-500">
                  {edu.startDate} —<br />{edu.current ? 'Present' : edu.endDate}
                </div>
                <div className="col-span-3">
                  <h3 className="font-bold text-zinc-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <div className="text-zinc-600">{edu.institution}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-12">
          <h2 className="text-zinc-400 uppercase tracking-widest mb-4 text-xs">Skills</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {skills.map((skill, i) => (
              <span key={i} className="text-zinc-900">{skill}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
