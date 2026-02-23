import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateProfile } from '@/hooks/useProfile';
import { GraduationCap, Loader2 } from 'lucide-react';

export default function Onboarding() {
  const [term, setTerm] = useState('WS');
  const [year, setYear] = useState('2025');
  const [focus, setFocus] = useState<string | null>(null);
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();

  const handleFinish = async () => {
    await updateProfile.mutateAsync({
      start_semester_term: term,
      start_semester_year: parseInt(year),
      focus_tag: focus,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Set Up Your Profile</h1>
          <p className="text-muted-foreground mt-2">Tell us about your studies to personalize your planner.</p>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 card-shadow space-y-6">
          <div className="space-y-2">
            <Label>Start Semester</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WS">Winter (WS)</SelectItem>
                  <SelectItem value="SS">Summer (SS)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026, 2027].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Focus Area (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {['Theory', 'Systems', 'Software'].map(f => (
                <button
                  key={f}
                  onClick={() => setFocus(focus === f ? null : f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    focus === f
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-accent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleFinish} className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
