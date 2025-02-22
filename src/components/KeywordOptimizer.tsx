// src/components/KeywordOptimizer.tsx
import React, { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { uploadResume, analyzeResume, resetOptimizer, setJobDescription } from '@/store/resumeSlice';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, UploadIcon, CheckCircleIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KeywordOptimizer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    jobDescription, 
    keywords, 
    matchedKeywords, 
    score,
    isLoading,
    error,
    suggestions = [],
    keySkillsAnalysis = '',
    improvementAreas = ''
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Resume Keyword Optimizer</CardTitle>
            <CardDescription>
              Upload your resume and paste the job description to get AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Resume Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Upload Your Resume
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleResumeFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 transition-colors hover:border-gray-400"
                    >
                      <UploadIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Select your resume file'}
                      </span>
                    </label>
                  </div>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    File selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {/* Job Description Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !jobDescription || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : 'Analyze Resume'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {!isLoading && (keywords.length > 0 || matchedKeywords.length > 0) && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Match Overview</CardTitle>
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

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Key Skills Analysis</h3>
                    <p className="text-sm text-muted-foreground">{keySkillsAnalysis}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions">
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="improvements">
                      <AccordionTrigger>Improvement Suggestions</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="detailed">
                      <AccordionTrigger>Detailed Analysis</AccordionTrigger>
                      <AccordionContent>
                        <div className="prose max-w-none">
                          <p className="text-sm text-muted-foreground">
                            {improvementAreas}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default KeywordOptimizer;