// src/components/KeywordOptimizer.tsx
import React, { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { uploadResume, analyzeResume, resetOptimizer, setJobDescription } from '@/store/resumeSlice';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

const KeywordOptimizer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    jobDescription, 
    keywords, 
    matchedKeywords, 
    score,
    isLoading,
    error 
  } = useAppSelector(state => state.resume);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleResumeFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleJobDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setJobDescription(e.target.value));
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      return;
    }
    await dispatch(uploadResume(selectedFile));
    if (jobDescription) {
      dispatch(analyzeResume());
    }
  };

  const handleReset = () => {
    dispatch(resetOptimizer());
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Resume Keyword Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Upload Your Resume
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleResumeFileSelect}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !jobDescription || isLoading}
                >
                  {isLoading ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : 'Analyze'}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Job Description
              </label>
              <Textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                className="min-h-[200px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && (keywords.length > 0 || matchedKeywords.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Match Score</h3>
              <div className="space-y-2">
                <Progress value={score} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Your resume matches {score}% of the key skills and requirements
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {keyword}
                  </Badge>
                ))}
                {matchedKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No matches found</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywords
                  .filter(keyword => !matchedKeywords.includes(keyword))
                  .map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {keyword}
                    </Badge>
                  ))}
              </div>
            </div>

            <Button onClick={handleReset} variant="outline">
              Start Over
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordOptimizer;