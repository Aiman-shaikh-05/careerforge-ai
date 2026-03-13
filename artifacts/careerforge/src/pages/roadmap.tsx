import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthHeaders } from "@/lib/utils";
import { useGetProfile, useGetLatestRoadmap, useGenerateRoadmap } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Map, Loader2, Sparkles, CheckCircle2, BookOpen } from "lucide-react";

export default function RoadmapPage() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile(headers);
  const { data: roadmap, isLoading: isLoadingRoadmap } = useGetLatestRoadmap(headers);
  const generateMutation = useGenerateRoadmap(headers);

  const handleGenerate = () => {
    if (!profile) return;
    generateMutation.mutate(
      { 
        data: {
          targetRole: profile.targetRole || "Software Engineer",
          currentSkills: profile.skills || [],
          experienceLevel: "beginner"
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/roadmap/latest"] });
        }
      }
    );
  };

  const currentRoadmap = generateMutation.data || roadmap;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-3xl border border-primary/20">
          <div>
            <Badge variant="accent" className="mb-4">Personalized Plan</Badge>
            <h1 className="text-3xl font-display font-bold">Career Roadmap</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              A step-by-step learning path customized for your transition into <strong className="text-foreground">{profile?.targetRole || "your dream role"}</strong>.
            </p>
          </div>
          <Button size="lg" onClick={handleGenerate} isLoading={generateMutation.isPending} className="gap-2 shadow-xl">
            <Sparkles className="w-5 h-5" /> Regenerate Path
          </Button>
        </header>

        {isLoadingRoadmap ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : !currentRoadmap ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Map className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">No roadmap generated</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Generate a structured timeline of what to learn next based on your current skills and goals.
              </p>
              <Button onClick={handleGenerate} isLoading={generateMutation.isPending}>Create My Roadmap</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative pl-4 md:pl-0">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

            <div className="space-y-12">
              {currentRoadmap.milestones.map((milestone, index) => (
                <div key={milestone.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[-20px] md:left-[50%] w-10 h-10 rounded-full border-4 border-background bg-primary shadow-lg -translate-x-1/2 flex items-center justify-center z-10 text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="w-full md:w-1/2 md:px-12 pl-8 pb-4">
                    <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <Badge variant={milestone.level === 'beginner' ? 'success' : milestone.level === 'advanced' ? 'destructive' : 'accent'}>
                            {milestone.level}
                          </Badge>
                          <span className="text-sm font-bold text-muted-foreground">{milestone.estimatedWeeks} weeks</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground text-sm mb-6">{milestone.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Topics to Master</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {milestone.topics.map(t => (
                                <Badge key={t} variant="secondary" className="font-medium bg-secondary text-secondary-foreground">{t}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5"><BookOpen className="w-4 h-4"/> Key Resources</h4>
                            <ul className="space-y-1.5">
                              {milestone.resources.map((r, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-1.5 shrink-0" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
