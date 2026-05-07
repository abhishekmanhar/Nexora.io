import React from 'react';
import { ResumeData } from '../../types/resume';

export function AtsTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="font-serif text-black bg-white w-full text-sm leading-relaxed break-words">
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 overflow-hidden">{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
          {data.personalInfo.github && <span>• {data.personalInfo.github}</span>}
          {data.personalInfo.website && <span>• {data.personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2">Professional Summary</h2>
          <p className="text-justify">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold">
                  <h3 className="text-base">{exp.position}</h3>
                  <span className="text-sm font-normal">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="font-semibold italic mb-1">{exp.company}</div>
                <ul className="list-disc list-inside space-y-1">
                  {exp.description.split('\n').map((line, i) => {
                    const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                    if (!cleanLine) return null;
                    return <li key={i} className="text-justify">{cleanLine}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold">
                  <h3 className="text-base">{edu.institution}</h3>
                  <span className="text-sm font-normal">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <div>{edu.degree} in {edu.fieldOfStudy}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold">
                  <h3 className="text-base">{proj.name}</h3>
                  {proj.link && (
                    <a href={proj.link} className="text-sm font-normal underline text-blue-800">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {proj.technologies.length > 0 && (
                  <div className="italic text-sm mb-1">Technologies: {proj.technologies.join(', ')}</div>
                )}
                <p className="text-justify">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
          <p className="leading-relaxed">
            {data.skills.join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
}
