
import React, { createContext, useContext, useState } from 'react';

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  hobbies: string[];
}

interface GeneratedContent {
  resumeContent: string;
  coverLetterContent: string;
}

interface ResumeContextType {
  resumeData: ResumeData;
  generatedContent: GeneratedContent | null;
  updatePersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void;
  updateExperiences: (experiences: Experience[]) => void;
  updateEducation: (education: Education[]) => void;
  updateSkills: (skills: string[]) => void;
  updateCertifications: (certifications: string[]) => void;
  updateHobbies: (hobbies: string[]) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  clearResumeData: () => void;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experiences: [{
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  }],
  education: [{
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
  }],
  skills: [''],
  certifications: [''],
  hobbies: [''],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : defaultResumeData;
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const saveToLocalStorage = (data: ResumeData) => {
    localStorage.setItem('resumeData', JSON.stringify(data));
  };

  const updatePersonalInfo = (data: Partial<ResumeData['personalInfo']>) => {
    const updated = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        ...data,
      },
    };
    setResumeData(updated);
    saveToLocalStorage(updated);
  };

  const updateExperiences = (experiences: Experience[]) => {
    const updated = { ...resumeData, experiences };
    setResumeData(updated);
    saveToLocalStorage(updated);
  };

  const updateEducation = (education: Education[]) => {
    const updated = { ...resumeData, education };
    setResumeData(updated);
    saveToLocalStorage(updated);
  };

  const updateSkills = (skills: string[]) => {
    const updated = { ...resumeData, skills };
    setResumeData(updated);
    saveToLocalStorage(updated);
  };

  const updateCertifications = (certifications: string[]) => {
    const updated = { ...resumeData, certifications };
    setResumeData(updated);
    saveToLocalStorage(updated);
  };

  const updateHobbies = (hobbies: string[]) => {
    const updated = { ...resumeData, hobbies };
    setResumeData(updated);
    saveToLocalStorage(updated);
  };

  const clearResumeData = () => {
    setResumeData(defaultResumeData);
    localStorage.removeItem('resumeData');
  };

  const value: ResumeContextType = {
    resumeData,
    generatedContent,
    updatePersonalInfo,
    updateExperiences,
    updateEducation,
    updateSkills,
    updateCertifications,
    updateHobbies,
    setGeneratedContent,
    clearResumeData,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};
