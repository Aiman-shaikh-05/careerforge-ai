import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthHeaders } from "@/lib/utils";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";

export default function Profile() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetProfile(headers);
  const updateMutation = useUpdateProfile(headers);

  const [formData, setFormData] = useState({
    college: "",
    branch: "",
    year: "",
    targetRole: "",
    bio: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        college: profile.college || "",
        branch: profile.branch || "",
        year: profile.year || "",
        targetRole: profile.targetRole || "",
        bio: profile.bio || "",
      });
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
    }
  }, [profile]);

  const handleSave = () => {
    updateMutation.mutate(
      { data: { ...formData, skills, interests } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
          // Could show a success toast here
        }
      }
    );
  };

  const addTag = (type: 'skill' | 'interest') => {
    if (type === 'skill' && skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    } else if (type === 'interest' && interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const removeTag = (type: 'skill' | 'interest', tag: string) => {
    if (type === 'skill') setSkills(skills.filter(s => s !== tag));
    if (type === 'interest') setInterests(interests.filter(i => i !== tag));
  };

  if (isLoading) return <DashboardLayout><div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-display font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your academic details and career interests.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">College/University</label>
              <Input value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} placeholder="e.g. Stanford University" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch/Major</label>
              <Input value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} placeholder="e.g. Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year of Study</label>
              <select 
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year+</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Role</label>
              <Input value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})} placeholder="e.g. Frontend Developer" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Short Bio</label>
              <textarea 
                className="flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[100px]"
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Interests</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="text-sm font-medium">Skills</label>
              <div className="flex gap-2">
                <Input 
                  value={skillInput} 
                  onChange={e => setSkillInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && addTag('skill')}
                  placeholder="e.g. React, Python" 
                />
                <Button variant="secondary" onClick={() => addTag('skill')}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1.5 text-sm gap-1">
                    {skill}
                    <button onClick={() => removeTag('skill', skill)} className="hover:bg-black/10 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Interests</label>
              <div className="flex gap-2">
                <Input 
                  value={interestInput} 
                  onChange={e => setInterestInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && addTag('interest')}
                  placeholder="e.g. Machine Learning, UI/UX" 
                />
                <Button variant="secondary" onClick={() => addTag('interest')}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <Badge key={interest} variant="outline" className="pl-3 pr-1 py-1.5 text-sm gap-1 bg-background border-primary/20">
                    {interest}
                    <button onClick={() => removeTag('interest', interest)} className="hover:bg-black/10 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} isLoading={updateMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
