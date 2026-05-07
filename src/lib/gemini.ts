import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types/resume";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OptimizationSuggestion {
  section: string;
  recommendation: string;
}

export interface OptimizationResult {
  score: number;
  missingKeywords: string[];
  suggestions: OptimizationSuggestion[];
  optimizedData: ResumeData;
}

export async function extractResumeFromPortfolio(url: string): Promise<ResumeData> {
  const prompt = `
    You are an expert data extractor.
    I will provide you with a URL to a user's portfolio or personal website.
    Your task is to extract their professional information (name, email, skills, experience, projects, education) 
    and format it into a structured resume JSON object.
    If some information is missing, leave it blank or omit it.
    
    URL to extract from: ${url}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                website: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                },
              },
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  technologies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{}') as ResumeData;
    
    // Ensure IDs are present
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    if (result.experience) {
      result.experience = result.experience.map(exp => ({ ...exp, id: exp.id || generateId() }));
    } else {
      result.experience = [];
    }
    
    if (result.education) {
      result.education = result.education.map(edu => ({ ...edu, id: edu.id || generateId() }));
    } else {
      result.education = [];
    }
    
    if (result.projects) {
      result.projects = result.projects.map(proj => ({ ...proj, id: proj.id || generateId() }));
    } else {
      result.projects = [];
    }
    
    if (!result.skills) result.skills = [];
    if (!result.personalInfo) result.personalInfo = { fullName: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' };

    return result;
  } catch (error) {
    console.error("Error extracting from portfolio:", error);
    throw error;
  }
}

export async function optimizeResume(resumeData: ResumeData, jobDescription: string): Promise<OptimizationResult> {
  const prompt = `
    You are an expert resume writer and ATS optimizer. 
    I will provide you with a user's current resume data and a target job description.
    Your task is to:
    1. Compare the resume against the job description.
    2. Identify missing keywords and underemphasized skills.
    3. Provide actionable suggestions for improvement.
    4. Provide an optimized version of the resume data that incorporates these improvements 
       (rephrasing experience, summary, and suggesting relevant skills).
    
    Do NOT invent fake experience or education. Only rephrase and emphasize existing points 
    to align with the target job.
    
    Current Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Target Job Description:
    ${jobDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Match score out of 100" },
            missingKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Keywords from the job description missing in the resume"
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING, description: "e.g., 'Experience', 'Summary', 'Skills'" },
                  recommendation: { type: Type.STRING, description: "Actionable advice" }
                }
              }
            },
            optimizedData: {
              type: Type.OBJECT,
              properties: {
                personalInfo: {
                  type: Type.OBJECT,
                  properties: {
                    fullName: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                    website: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    github: { type: Type.STRING },
                    summary: { type: Type.STRING, description: "Optimized professional summary" },
                  },
                },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      company: { type: Type.STRING },
                      position: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      current: { type: Type.BOOLEAN },
                      description: { type: Type.STRING, description: "Optimized bullet points for experience" },
                    },
                  },
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      institution: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      fieldOfStudy: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      current: { type: Type.BOOLEAN },
                    },
                  },
                },
                skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Optimized list of skills matching the job description",
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING, description: "Optimized project description" },
                      link: { type: Type.STRING },
                      technologies: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            }
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{}') as OptimizationResult;
    return result;
  } catch (error) {
    console.error("Error optimizing resume:", error);
    throw error;
  }
}
