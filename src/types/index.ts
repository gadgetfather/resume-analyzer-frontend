export interface ResumeState {
    resumeText: string;
    jobDescription: string;
    keywords: string[];
    matchedKeywords: string[];
    score: number;
    isLoading: boolean;
    error: string | null;
    fileUploadProgress: number;
    suggestions: string[];
    keySkillsAnalysis: string;
    improvementAreas: string;
  }