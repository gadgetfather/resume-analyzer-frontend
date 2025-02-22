// src/features/resumeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ResumeState } from '../types';
import axios from 'axios';
import { config } from '@/config';

const initialState: ResumeState = {
  resumeText: '',
  jobDescription: '',
  keywords: [],
  matchedKeywords: [],
  score: 0,
  isLoading: false,
  error: null,
  fileUploadProgress: 0,
  suggestions: [],            // Add this
  keySkillsAnalysis: '',     // Add this
  improvementAreas: '',      // Add this
};

// Only keep resume upload thunk
export const uploadResume = createAsyncThunk(
  'resume/uploadResume',
  async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${config.API_URL}/upload/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  }
);

export const analyzeResume = createAsyncThunk(
  'resume/analyze',
  async (_, { getState }) => {
    const state = getState() as { resume: ResumeState };
    console.log('Sending analysis request:', {
      resume_text: state.resume.resumeText,
      job_description: state.resume.jobDescription
    });

    const response = await axios.post(`${config.API_URL}/analyze`, {
      resume_text: state.resume.resumeText,
      job_description: state.resume.jobDescription
    });

    console.log('Analysis response:', response.data);
    return response.data;
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload;
    },
    resetOptimizer: () => initialState,
  },
  extraReducers: (builder) => {
    // Handle Resume Upload
    builder
      .addCase(uploadResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumeText = action.payload.text;
        state.error = null;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to upload resume';
      })

    // Handle Analysis
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.keywords = action.payload.keywords || [];
        state.matchedKeywords = action.payload.matchedKeywords || [];
        state.score = action.payload.score || 0;
        state.suggestions = action.payload.suggestions || [];          // Add this
        state.keySkillsAnalysis = action.payload.keySkillsAnalysis || '';  // Add this
        state.improvementAreas = action.payload.improvementAreas || '';    // Add this
        state.error = null;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to analyze resume';
      });
  }
});

export const { setJobDescription, resetOptimizer } = resumeSlice.actions;
export default resumeSlice.reducer;