import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AtsAnalysisResult {
  score: number;
  keywordMatch: number;
  formattingScore: number;
  impactScore: number;
  summary: string;
  foundKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  formattingIssues: string[];
}

export async function analyzeResumeWithGemini(resumeText: string): Promise<AtsAnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a Senior ATS (Applicant Tracking System) Specialist and Expert Recruiter. 
  Your goal is to provide a highly accurate, objective, and detailed ATS analysis for a given resume.
  
  Score criteria:
  - Keyword Match (30%): Presence of relevant industry technical skills and roles.
  - Formatting (20%): Section clarity, consistent dating, contact information presence.
  - Impact & Metrics (30%): Use of strong verbs and quantifiable achievements.
  - Content Quality (20%): Summary strength and educational relevance.
  
  Analyze the provided resume text and return a JSON object strictly following this schema:
  {
    "score": number (0-100),
    "keywordMatch": number (0-30),
    "formattingScore": number (0-20),
    "impactScore": number (0-30),
    "summary": "Professional summary of the resume strength",
    "foundKeywords": ["list", "of", "found", "skills"],
    "missingKeywords": ["industry", "standard", "skills", "missing"],
    "recommendations": ["specific", "actionable", "improvement", "steps"],
    "formattingIssues": ["list", "of", "structural", "issues", "found"]
  }`;

  const prompt = `Resume Content to Analyze:
  ---
  ${resumeText}
  ---
  
  Please perform a deep analysis focusing on high-accuracy matching for modern ATS systems.`;

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          keywordMatch: { type: Type.NUMBER },
          formattingScore: { type: Type.NUMBER },
          impactScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          foundKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "keywordMatch", "formattingScore", "impactScore", "summary", "foundKeywords", "missingKeywords", "recommendations", "formattingIssues"]
      }
    }
  });

  return JSON.parse(result.text);
}
