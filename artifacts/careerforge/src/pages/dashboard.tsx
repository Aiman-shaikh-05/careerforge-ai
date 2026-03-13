import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useGetProfile } from "@workspace/api-client-react";
import { useAuthHeaders } from "@/lib/utils";
import { FileText, Briefcase, Map, MessageSquare, Loader2, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const headers = useAuthHeaders();
  const { data: profile, isLoading } = useGetProfile(headers);

  const quickActions = [
    { title: "Upload Resume", desc: "Get AI-powered feedback", icon: FileText, href: "/resume", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Find Projects", desc: "Build your portfolio", icon: Briefcase, href: "/projects", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Career Roadmap", desc: "Plan your learning path", icon: Map, href: "/roadmap", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Mock Interview", desc: "Practice with AI", icon: MessageSquare, href: "/interview", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold">Hello, {user?.fullName?.split(" ")[0]} 👋</h1>
            <p className="text-lg text-muted-foreground mt-2">Welcome to your personalized career copilot.</p>
          </div>
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Profile Completion</h3>
                <p className="text-muted-foreground">
                  A complete profile helps our AI generate better recommendations for projects, jobs, and interviews.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{isLoading ? "Loading..." : `${profile?.completionPercentage || 0}%`}</span>
                    <span className="text-primary">Action required</span>
                  </div>
                  <Progress value={profile?.completionPercentage || 0} className="h-3" />
                </div>
                {profile?.completionPercentage !== 100 && (
                  <Link href="/profile">
                    <Button className="mt-2">Complete Profile</Button>
                  </Link>
                )}
              </div>
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center rounded-full border-8 border-primary/20">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <span className="text-3xl font-bold text-primary">{profile?.completionPercentage || 0}%</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Role</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Loading...</div>
              ) : profile?.targetRole ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary text-center">
                    <span className="font-bold text-xl text-primary">{profile.targetRole}</span>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    All recommendations are currently optimized for this role.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p className="text-muted-foreground text-sm">No target role set yet.</p>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">Set Target Role</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href} className="block group">
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.bg}`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.desc}</p>
                    <div className="flex items-center text-sm font-semibold text-primary">
                      Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
