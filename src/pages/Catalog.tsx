import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useAllModules, useUserModules, useAddModule, useUpdateStatus, useRemoveModule } from '@/hooks/useModules';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Search, Plus, CheckCircle2, Loader2, BookOpen, X } from 'lucide-react';
import type { UserModuleWithModule } from '@/lib/degree-rules';

const groupLabels: Record<string, string> = {
  A1: 'Software System Science',
  A2: 'Domain-specific',
  A3: 'Seminar & Project',
  A4: 'Thesis',
  A5: 'International Experience',
};

export default function Catalog() {
  const { user } = useAuth();
  const { data: modules, isLoading } = useAllModules();
  const { data: userModules } = useUserModules();
  const { data: profile } = useProfile();
  const addModule = useAddModule();
  const updateStatus = useUpdateStatus();
  const removeModule = useRemoveModule();

  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const ums = (userModules || []) as unknown as UserModuleWithModule[];
  const userModuleMap = useMemo(() => {
    const m = new Map<string, UserModuleWithModule>();
    ums.forEach(um => m.set(um.module_id, um));
    return m;
  }, [ums]);

  const filtered = useMemo(() => {
    if (!modules) return [];
    return modules.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase());
      const matchGroup = groupFilter === 'all' || m.module_group === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [modules, search, groupFilter]);

  const handleAdd = (moduleId: string) => {
    const term = profile?.start_semester_term || 'WS';
    const year = profile?.start_semester_year || 2025;
    addModule.mutate({ moduleId, semesterTerm: term, semesterYear: year });
  };

  const handleMarkPassed = (um: UserModuleWithModule) => {
    updateStatus.mutate({ id: um.id, status: 'passed' });
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
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Module Catalog</h1>
          <p className="text-muted-foreground">Browse and add ISSS modules to your plan</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {Object.entries(groupLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{k} — {v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(mod => {
              const um = userModuleMap.get(mod.id);
              return (
                <motion.div
                  key={mod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl bg-card border border-border p-4 card-shadow cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => setSelectedModule(mod)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">{mod.code}</p>
                      <h3 className="text-sm font-semibold text-foreground truncate">{mod.title}</h3>
                    </div>
                    <span className="text-sm font-mono font-medium text-primary whitespace-nowrap">{mod.ects} ECTS</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{mod.module_group}{mod.area ? `/${mod.area}` : ''}</span>
                    <span className="text-xs text-muted-foreground">{mod.frequency}</span>
                    <span className="text-xs text-muted-foreground">{mod.language}</span>
                  </div>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {um ? (
                      <div className="flex items-center gap-2 w-full">
                        <StatusBadge status={um.status as any} />
                        {um.status !== 'passed' && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkPassed(um)} className="text-xs h-7">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Passed
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => removeModule.mutate(um.id)} className="text-xs h-7 ml-auto text-destructive">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => handleAdd(mod.id)} className="text-xs h-7 gap-1" disabled={addModule.isPending}>
                        <Plus className="h-3 w-3" /> Add to Plan
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No modules found matching your filters.</p>
          </div>
        )}

        {/* Detail Drawer */}
        <Sheet open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <SheetContent>
            {selectedModule && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedModule.title}</SheetTitle>
                  <SheetDescription>{selectedModule.code}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">ECTS:</span> <span className="font-medium">{selectedModule.ects}</span></div>
                    <div><span className="text-muted-foreground">Group:</span> <span className="font-medium">{selectedModule.module_group}{selectedModule.area ? `/${selectedModule.area}` : ''}</span></div>
                    <div><span className="text-muted-foreground">Frequency:</span> <span className="font-medium">{selectedModule.frequency}</span></div>
                    <div><span className="text-muted-foreground">Language:</span> <span className="font-medium">{selectedModule.language}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Exam:</span> <span className="font-medium">{selectedModule.exam_type}</span></div>
                  </div>
                  {selectedModule.description && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedModule.description}</p>
                    </div>
                  )}
                  {!userModuleMap.has(selectedModule.id) && (
                    <Button onClick={() => { handleAdd(selectedModule.id); setSelectedModule(null); }} className="w-full gap-2">
                      <Plus className="h-4 w-4" /> Add to Plan
                    </Button>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}
