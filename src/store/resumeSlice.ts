// src/features/resumeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ResumeState } from '../types';
import axios from 'axios';

const initialState: ResumeState = {
  resumeText: '',
  jobDescription: '',
  keywords: [],
  matchedKeywords: [],
  score: 0,
  isLoading: false,
  error: null,
  fileUploadProgress: 0,
};

// Only keep resume upload thunk
export const uploadResume = createAsyncThunk(
  'resume/uploadResume',
  async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8000/upload/resume', formData, {
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
    const response = await axios.post('http://localhost:8000/analyze', {
      resume_text: state.resume.resumeText,
      job_description: state.resume.jobDescription
    });
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
        state.keywords = action.payload.keywords;
        state.matchedKeywords = action.payload.matchedKeywords;
        state.score = action.payload.score;
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