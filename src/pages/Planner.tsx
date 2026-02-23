import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useUserModules, useUpdateStatus, useUpdateSemester, useRemoveModule } from '@/hooks/useModules';
import { useProfile } from '@/hooks/useProfile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserModuleWithModule } from '@/lib/degree-rules';
import { getEffectiveEcts } from '@/lib/degree-rules';

function semesterKey(term: string, year: number) {
  return `${term} ${year}`;
}

function semesterLabel(term: string, year: number) {
  return term === 'WS' ? `WS ${year}/${(year + 1).toString().slice(-2)}` : `SS ${year}`;
}

function generateSemesters(startTerm: string, startYear: number, count: number) {
  const semesters: { term: string; year: number }[] = [];
  let t = startTerm;
  let y = startYear;
  for (let i = 0; i < count; i++) {
    semesters.push({ term: t, year: y });
    if (t === 'WS') { t = 'SS'; y += 1; }
    else { t = 'WS'; }
  }
  return semesters;
}

export default function Planner() {
  const { data: userModules, isLoading } = useUserModules();
  const { data: profile } = useProfile();
  const updateStatus = useUpdateStatus();
  const updateSemester = useUpdateSemester();
  const removeModule = useRemoveModule();

  const startTerm = profile?.start_semester_term || 'WS';
  const startYear = profile?.start_semester_year || 2025;
  const semesters = useMemo(() => generateSemesters(startTerm, startYear, 8), [startTerm, startYear]);
  const [visibleStart, setVisibleStart] = useState(0);

  const ums = (userModules || []) as unknown as UserModuleWithModule[];

  const bySemester = useMemo(() => {
    const map = new Map<string, UserModuleWithModule[]>();
    semesters.forEach(s => map.set(semesterKey(s.term, s.year), []));
    ums.forEach(um => {
      const key = semesterKey(um.semester_term, um.semester_year);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(um);
    });
    return map;
  }, [ums, semesters]);

  const visibleCount = 4;
  const visible = semesters.slice(visibleStart, visibleStart + visibleCount);

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
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Semester Planner</h1>
            <p className="text-muted-foreground">Organize your modules across semesters</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVisibleStart(Math.max(0, visibleStart - 1))}
              disabled={visibleStart === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVisibleStart(Math.min(semesters.length - visibleCount, visibleStart + 1))}
              disabled={visibleStart >= semesters.length - visibleCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Semester columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map(sem => {
            const key = semesterKey(sem.term, sem.year);
            const mods = bySemester.get(key) || [];
            const totalEcts = mods.reduce((s, um) => s + getEffectiveEcts(um), 0);

            return (
              <div key={key} className="rounded-xl bg-card border border-border p-4 card-shadow min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">{semesterLabel(sem.term, sem.year)}</h3>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{totalEcts} ECTS</span>
                </div>

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {mods.map(um => (
                      <motion.div
                        key={um.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-lg bg-background border border-border p-3 text-sm"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground text-xs truncate">{um.modules.title}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{um.modules.code} · {getEffectiveEcts(um)} ECTS</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeModule.mutate(um.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={um.status}
                            onValueChange={v => updateStatus.mutate({ id: um.id, status: v })}
                          >
                            <SelectTrigger className="h-6 text-[10px] w-auto min-w-[80px] border-0 bg-transparent p-0 px-1">
                              <StatusBadge status={um.status as any} className="text-[10px] px-1.5 py-0" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="passed">Passed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={semesterKey(um.semester_term, um.semester_year)}
                            onValueChange={v => {
                              const [t, y] = v.split(' ');
                              updateSemester.mutate({ id: um.id, semesterTerm: t, semesterYear: parseInt(y) });
                            }}
                          >
                            <SelectTrigger className="h-6 text-[10px] w-auto min-w-[70px] border-0 bg-transparent p-0 px-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {semesters.map(s => (
                                <SelectItem key={semesterKey(s.term, s.year)} value={semesterKey(s.term, s.year)}>
                                  {semesterLabel(s.term, s.year)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {mods.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      No modules yet
                    </div>
                  )}
                </div>

                {totalEcts > 30 && (
                  <p className="text-xs text-warning mt-2">⚠ High workload ({totalEcts} ECTS)</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
