import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthHeaders } from "@/lib/utils";
import { useGetProfile, useGenerateInterviewQuestions, useGetInterviewSessions } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Loader2, Sparkles, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

export default function InterviewPage() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile(headers);
  const { data: sessions, isLoading: isLoadingSessions } = useGetInterviewSessions(headers);
  const generateMutation = useGenerateInterviewQuestions(headers);
  
  const [expandedHint, setExpandedHint] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!profile) return;
    generateMutation.mutate(
      { 
        data: {
          targetRole: profile.targetRole || "Software Engineer",
          skills: profile.skills || [],
          questionCount: 5
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/interview/sessions"] });
        }
      }
    );
  };

  const activeSession = generateMutation.data || (sessions && sessions.length > 0 ? sessions[0] : null);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-display font-bold">Mock Interview Prep</h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Practice answering AI-generated questions specific to your target role and skill set.
            </p>
          </div>
          <Button onClick={handleGenerate} isLoading={generateMutation.isPending} className="bg-white text-slate-900 hover:bg-slate-200">
            <Sparkles className="w-4 h-4 mr-2" /> Start New Session
          </Button>
        </header>

        {isLoadingSessions ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : !activeSession ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to practice?</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Generate a set of technical and behavioral questions tailored for your dream job.
              </p>
              <Button onClick={handleGenerate} isLoading={generateMutation.isPending}>Generate Questions</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Practice Session: {activeSession.targetRole}</h2>
              <span className="text-sm text-muted-foreground">{new Date(activeSession.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="space-y-4">
              {activeSession.questions.map((q, index) => (
                <Card key={q.id} className="transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider bg-secondary/50">
                          {q.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant={q.difficulty === 'hard' ? 'destructive' : q.difficulty === 'medium' ? 'accent' : 'success'} className="uppercase text-[10px] tracking-wider">
                          {q.difficulty}
                        </Badge>
                      </div>
                      <span className="text-2xl font-display font-bold text-muted-foreground/30">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-relaxed">{q.question}</CardTitle>
                  </CardHeader>
                  
                  {q.hint && (
                    <CardContent className="pt-4 border-t border-border/50 mt-4">
                      <button 
                        onClick={() => setExpandedHint(expandedHint === q.id ? null : q.id)}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline w-full text-left"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {expandedHint === q.id ? 'Hide advice' : 'Show advice on how to answer'}
                        {expandedHint === q.id ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                      </button>
                      
                      {expandedHint === q.id && (
                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground/80 leading-relaxed animate-in fade-in slide-in-from-top-2">
                          {q.hint}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
