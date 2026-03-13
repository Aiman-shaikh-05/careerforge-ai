import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthHeaders } from "@/lib/utils";
import { useGetResumes, useUploadResume, useAnalyzeResume, useGetResumeFeedback } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { FileUp, File, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResumePage() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { data: resumes, isLoading: isLoadingResumes } = useGetResumes(headers);
  const uploadMutation = useUploadResume(headers);
  const analyzeMutation = useAnalyzeResume(headers);
  
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const { data: feedback, isLoading: isLoadingFeedback } = useGetResumeFeedback(selectedResumeId || 0, {
    ...headers,
    query: { enabled: !!selectedResumeId }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(
        { data: { file } },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/resume"] });
            setSelectedResumeId(data.id);
          }
        }
      );
    }
  };

  const handleAnalyze = (id: number) => {
    setSelectedResumeId(id);
    analyzeMutation.mutate(
      { resumeId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/resume"] });
          queryClient.invalidateQueries({ queryKey: [`/api/resume/${id}/feedback`] });
        }
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-display font-bold">Resume Analysis</h1>
          <p className="text-muted-foreground mt-2">Upload your resume to get AI-powered feedback and ATS scoring.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-dashed border-2 bg-secondary/50">
              <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                <FileUp className="w-12 h-12 text-primary/50 mb-4" />
                <h3 className="font-bold mb-2">Upload New Resume</h3>
                <p className="text-sm text-muted-foreground mb-4">PDF format, up to 5MB</p>
                <div className="relative">
                  <Button variant="outline" isLoading={uploadMutation.isPending}>Browse Files</Button>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Your Resumes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingResumes ? (
                  <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : resumes?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No resumes uploaded yet.</p>
                ) : (
                  resumes?.map(resume => (
                    <div 
                      key={resume.id} 
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${selectedResumeId === resume.id ? 'border-primary bg-primary/5' : 'hover:bg-secondary'}`}
                      onClick={() => setSelectedResumeId(resume.id)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-background rounded-lg shrink-0">
                          <File className="w-4 h-4 text-primary" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold truncate">{resume.fileName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(resume.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {!selectedResumeId ? (
              <Card className="h-full min-h-[400px] flex items-center justify-center bg-secondary/30">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Select or upload a resume to view analysis</p>
                </div>
              </Card>
            ) : (
              <Card className="h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>AI Analysis Report</CardTitle>
                    <CardDescription>Based on ATS standards and industry best practices</CardDescription>
                  </div>
                  <Button 
                    onClick={() => handleAnalyze(selectedResumeId)} 
                    isLoading={analyzeMutation.isPending}
                  >
                    Generate New Report
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingFeedback || analyzeMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="text-muted-foreground animate-pulse">Analyzing document structure and content...</p>
                    </div>
                  ) : !feedback ? (
                    <div className="text-center py-20 text-muted-foreground">
                      No feedback generated yet. Click the button above to analyze.
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                        <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-inner">
                          <svg className="absolute w-full h-full -rotate-90">
                            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                            <circle 
                              cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                              className={`${feedback.atsScore > 75 ? 'text-emerald-500' : feedback.atsScore > 50 ? 'text-amber-500' : 'text-destructive'}`}
                              strokeDasharray="251.2" 
                              strokeDashoffset={251.2 - (251.2 * feedback.atsScore) / 100} 
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="text-center">
                            <span className="text-2xl font-bold">{feedback.atsScore}</span>
                            <span className="text-xs text-muted-foreground block">/100</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">ATS Match Score</h3>
                          <p className="text-sm text-muted-foreground">{feedback.summary}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Key Strengths</h4>
                          <ul className="space-y-2">
                            {feedback.strengths.map((s, i) => (
                              <li key={i} className="text-sm p-3 bg-emerald-50 text-emerald-900 rounded-lg">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2"><AlertCircle className="w-5 h-5 text-destructive"/> Missing Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {feedback.missingSkills.map((s, i) => (
                              <Badge key={i} variant="destructive" className="bg-destructive/10 text-destructive">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Recommended Improvements</h4>
                        <div className="space-y-3">
                          {feedback.improvements.map((imp, i) => (
                            <div key={i} className="p-4 rounded-xl border border-border/50 bg-secondary/30 text-sm">
                              {imp}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
