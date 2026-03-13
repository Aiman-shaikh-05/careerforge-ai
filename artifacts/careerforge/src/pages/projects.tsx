import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthHeaders } from "@/lib/utils";
import { useGetProfile, useGetProjectRecommendations, useGetSavedProjects } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, Loader2, Sparkles, Clock } from "lucide-react";

export default function Projects() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile(headers);
  const { data: savedProjects, isLoading: isLoadingSaved } = useGetSavedProjects(headers);
  const recommendMutation = useGetProjectRecommendations(headers);

  const handleGenerate = () => {
    if (!profile) return;
    recommendMutation.mutate(
      { 
        data: {
          skills: profile.skills || [],
          interests: profile.interests || [],
          targetRole: profile.targetRole || "Software Engineer",
          count: 6
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/projects/saved"] });
        }
      }
    );
  };

  const projects = recommendMutation.data || savedProjects || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Project Portfolio Ideas</h1>
            <p className="text-muted-foreground mt-2">AI-curated project ideas tailored to your skills and target role.</p>
          </div>
          <Button onClick={handleGenerate} isLoading={recommendMutation.isPending} className="gap-2">
            <Sparkles className="w-4 h-4" /> Generate New Ideas
          </Button>
        </header>

        {isLoadingSaved ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : projects.length === 0 ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Briefcase className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Generate project recommendations based on your profile to build a portfolio that stands out.
              </p>
              <Button onClick={handleGenerate} isLoading={recommendMutation.isPending}>Generate Projects</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                      project.difficulty === "beginner" ? "success" : 
                      project.difficulty === "advanced" ? "destructive" : "accent"
                    }>
                      {project.difficulty}
                    </Badge>
                    <Badge variant="outline">{project.domain}</Badge>
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                  
                  <div>
                    <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs font-medium">{tech}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs font-medium text-primary">Why it matches you:</p>
                    <p className="text-sm mt-1">{project.whyItMatches}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center text-sm text-muted-foreground font-medium border-t p-4 mt-auto">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> ~{project.estimatedHours} hrs</span>
                  <Button variant="ghost" size="sm" className="h-8 text-primary">Save Project</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
