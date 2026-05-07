import { create } from 'zustand';
import { ResumeData, TemplateType } from '../types/resume';

interface ResumeState {
  data: ResumeData;
  template: TemplateType;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<ResumeData['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, edu: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addProject: () => void;
  updateProject: (id: string, proj: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (id: string) => void;
  setTemplate: (template: TemplateType) => void;
  setFullData: (data: ResumeData) => void;
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: 'Alex Developer',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alex.dev',
    linkedin: 'linkedin.com/in/alexdev',
    github: 'github.com/alexdev',
    summary: 'Passionate full-stack engineer with 5+ years of experience building scalable web applications. Strong focus on React, Node.js, and cloud architecture.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Innovators Inc.',
      position: 'Senior Frontend Engineer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Led the migration of a legacy monolithic frontend to a modern React-based micro-frontend architecture.\n• Improved application load time by 40% through code splitting and lazy loading.\n• Mentored junior developers and established code review best practices.',
    },
    {
      id: '2',
      company: 'Web Solutions LLC',
      position: 'Full Stack Developer',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Developed and maintained RESTful APIs using Node.js and Express.\n• Built responsive user interfaces using React and Tailwind CSS.\n• Integrated third-party payment gateways (Stripe) for e-commerce clients.',
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      current: false,
    }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'GraphQL', 'AWS'],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with real-time inventory tracking and secure checkout.',
      link: 'github.com/alexdev/ecommerce',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    }
  ],
};

export const useResumeStore = create<ResumeState>((set) => ({
  data: initialData,
  template: 'ats',
  updatePersonalInfo: (info) => set((state) => ({
    data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } }
  })),
  addExperience: () => set((state) => ({
    data: {
      ...state.data,
      experience: [...state.data.experience, { id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]
    }
  })),
  updateExperience: (id, exp) => set((state) => ({
    data: {
      ...state.data,
      experience: state.data.experience.map((e) => e.id === id ? { ...e, ...exp } : e)
    }
  })),
  removeExperience: (id) => set((state) => ({
    data: {
      ...state.data,
      experience: state.data.experience.filter((e) => e.id !== id)
    }
  })),
  addEducation: () => set((state) => ({
    data: {
      ...state.data,
      education: [...state.data.education, { id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false }]
    }
  })),
  updateEducation: (id, edu) => set((state) => ({
    data: {
      ...state.data,
      education: state.data.education.map((e) => e.id === id ? { ...e, ...edu } : e)
    }
  })),
  removeEducation: (id) => set((state) => ({
    data: {
      ...state.data,
      education: state.data.education.filter((e) => e.id !== id)
    }
  })),
  updateSkills: (skills) => set((state) => ({
    data: { ...state.data, skills }
  })),
  addProject: () => set((state) => ({
    data: {
      ...state.data,
      projects: [...state.data.projects, { id: crypto.randomUUID(), name: '', description: '', link: '', technologies: [] }]
    }
  })),
  updateProject: (id, proj) => set((state) => ({
    data: {
      ...state.data,
      projects: state.data.projects.map((p) => p.id === id ? { ...p, ...proj } : p)
    }
  })),
  removeProject: (id) => set((state) => ({
    data: {
      ...state.data,
      projects: state.data.projects.filter((p) => p.id !== id)
    }
  })),
  setTemplate: (template) => set({ template }),
  setFullData: (data) => set({ data }),
}));
