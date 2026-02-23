import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [term, setTerm] = useState(profile?.start_semester_term || 'WS');
  const [year, setYear] = useState(profile?.start_semester_year?.toString() || '2025');
  const [focus, setFocus] = useState(profile?.focus_tag || '');

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      start_semester_term: term,
      start_semester_year: parseInt(year),
      focus_tag: focus || null,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card border border-border p-6 card-shadow space-y-6"
        >
          <div>
            <Label className="text-muted-foreground text-sm">Email</Label>
            <p className="font-medium text-foreground">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <Label>Start Semester</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WS">Winter (WS)</SelectItem>
                  <SelectItem value="SS">Summer (SS)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026, 2027].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Focus Area</Label>
            <div className="flex flex-wrap gap-2">
              {['Theory', 'Systems', 'Software'].map(f => (
                <button
                  key={f}
                  onClick={() => setFocus(focus === f ? '' : f)}
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

          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border p-6 card-shadow space-y-4"
        >
          <h2 className="font-semibold text-foreground">Appearance</h2>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors w-full text-left"
          >
            {theme === 'light' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-warning" />}
            <span className="text-sm font-medium text-foreground">{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card border border-border p-6 card-shadow"
        >
          <Button variant="outline" onClick={handleSignOut} className="gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
