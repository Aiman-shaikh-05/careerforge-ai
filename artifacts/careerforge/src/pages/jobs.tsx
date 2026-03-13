import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthHeaders } from "@/lib/utils";
import { useGetProfile, useGetJobRecommendations, useGetSavedJobs } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Target, Loader2, Sparkles, TrendingUp, DollarSign } from "lucide-react";

export default function JobsPage() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile(headers);
  const { data: savedJobs, isLoading: isLoadingSaved } = useGetSavedJobs(headers);
  const recommendMutation = useGetJobRecommendations(headers);

  const handleGenerate = () => {
    if (!profile) return;
    recommendMutation.mutate(
      { 
        data: {
          skills: profile.skills || [],
          interests: profile.interests || [],
          targetRole: profile.targetRole
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/jobs/saved"] });
        }
      }
    );
  };

  const jobs = recommendMutation.data || savedJobs || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Role Recommendations</h1>
            <p className="text-muted-foreground mt-2">Discover career paths that perfectly align with your skill set.</p>
          </div>
          <Button onClick={handleGenerate} isLoading={recommendMutation.isPending} className="gap-2">
            <Sparkles className="w-4 h-4" /> Find Roles
          </Button>
        </header>

        {isLoadingSaved ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : jobs.length === 0 ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Target className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">No roles found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Run the AI analyzer to match your profile with current industry roles and demand.
              </p>
              <Button onClick={handleGenerate} isLoading={recommendMutation.isPending}>Analyze Profile</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pl-8 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-background">{job.domain}</Badge>
                    <Badge variant={job.growthOutlook === 'high' ? 'success' : 'secondary'} className="gap-1">
                      <TrendingUp className="w-3 h-3"/> {job.growthOutlook} growth
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="pl-8 space-y-6">
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  
                  <div className="space-y-2 bg-secondary/50 p-4 rounded-xl">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Profile Match</span>
                      <span className="text-primary">{job.matchPercentage}%</span>
                    </div>
                    <Progress value={job.matchPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground pt-1">{job.whyItMatches}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 border-t pt-4">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="sm:w-1/3">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Est. Salary</h4>
                      <div className="flex items-center gap-1.5 font-bold text-foreground bg-emerald-50 text-emerald-700 p-2 rounded-lg text-sm">
                        <DollarSign className="w-4 h-4"/> {job.salaryRange}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
