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
import { Search, Plus, CheckCircle2, Loader2, BookOpen, Trash2 } from 'lucide-react';
import type { UserModuleWithModule } from '@/lib/degree-rules';

const groupLabels: Record<string, string> = {
  A1: '🧠 Software System Science',
  A2: '🤖 Domain-specific',
  A3: '🎓 Seminar & Project',
  A4: '📖 Thesis',
  A5: '🌍 International Experience',
};

const getGradient = (group: string) => {
  switch (group) {
    case 'A1': return 'from-blue-400 via-blue-500 to-indigo-600';
    case 'A2': return 'from-green-400 via-emerald-500 to-green-600';
    case 'A3': return 'from-purple-400 via-purple-500 to-fuchsia-600';
    case 'A4': return 'from-amber-400 via-orange-500 to-red-500';
    case 'A5': return 'from-pink-400 via-rose-500 to-rose-600';
    default: return 'from-slate-400 via-slate-500 to-slate-600';
  }
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
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Module Catalog</h1>
          <p className="text-muted-foreground mt-1 text-lg">Browse and add ISSS modules to your plan</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 h-12 text-md rounded-xl"
            />
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-full sm:w-64 h-12 text-md rounded-xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="group relative rounded-[2rem] bg-card border border-border p-3 card-shadow cursor-pointer hover:shadow-xl transition-all flex flex-col h-full"
                  onClick={() => setSelectedModule(mod)}
                >
                  {/* Image Gradient Header */}
                  <div className={`relative h-44 rounded-t-[1.5rem] rounded-b-2xl mb-4 overflow-hidden bg-gradient-to-br ${getGradient(mod.module_group)}`}>
                    {/* Abstract Noise / Shapes Overlay */}
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60 scale-150 origin-top-left">
                        <circle cx="50" cy="50" r="180" fill="currentColor" />
                        <circle cx="350" cy="300" r="220" fill="currentColor" />
                      </svg>
                    </div>
                    {/* Inner Pills */}
                    <div className="absolute bottom-4 left-4 flex gap-2 items-center">
                      <span className="bg-white/95 text-slate-900 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm tracking-wide">
                        ISSS • {mod.module_group}{mod.area ? `/${mod.area}` : ''}
                      </span>
                      <span className="bg-white/95 text-slate-900 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm tracking-wide shrink-0">
                        {mod.ects} ECTS
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="px-3 pb-3 flex-1 flex flex-col">
                    <h3 className="text-[1.35rem] font-bold text-foreground leading-snug mb-2 line-clamp-2">
                      {mod.title}
                    </h3>

                    {/* Action Footer */}
                    <div className="mt-auto flex items-end justify-between pt-4" onClick={e => e.stopPropagation()}>
                      <p className="text-sm font-medium text-muted-foreground mr-2 truncate">
                        {mod.frequency}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {um ? (
                          <>
                            {um.status !== 'passed' && (
                              <button onClick={() => handleMarkPassed(um)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-primary transition-colors flex items-center justify-center" title="Mark Passed">
                                <CheckCircle2 className="h-5 w-5" />
                              </button>
                            )}
                            <button onClick={() => removeModule.mutate(um.id)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center" title="Remove">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => handleAdd(mod.id)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-primary transition-colors flex items-center justify-center" title="Add to Plan" disabled={addModule.isPending}>
                            <Plus className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No modules found matching your filters.</p>
          </div>
        )}

        {/* Detail Drawer */}
        <Sheet open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <SheetContent>
            {selectedModule && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-2xl">{selectedModule.title}</SheetTitle>
                  <SheetDescription className="text-base">{selectedModule.code}</SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div><span className="text-muted-foreground block mb-1">ECTS</span> <span className="font-semibold text-lg">{selectedModule.ects}</span></div>
                    <div><span className="text-muted-foreground block mb-1">Group</span> <span className="font-semibold text-lg">{selectedModule.module_group}{selectedModule.area ? `/${selectedModule.area}` : ''}</span></div>
                    <div><span className="text-muted-foreground block mb-1">Frequency</span> <span className="font-semibold text-base">{selectedModule.frequency}</span></div>
                    <div><span className="text-muted-foreground block mb-1">Language</span> <span className="font-semibold text-base">{selectedModule.language}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground block mb-1">Exam Type</span> <span className="font-semibold text-base capitalize">{selectedModule.exam_type}</span></div>
                  </div>
                  {selectedModule.description && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedModule.description}</p>
                    </div>
                  )}
                  {!userModuleMap.has(selectedModule.id) && (
                    <div className="pt-4 border-t border-border">
                      <Button onClick={() => { handleAdd(selectedModule.id); setSelectedModule(null); }} className="w-full gap-2 h-12 text-base rounded-xl">
                        <Plus className="h-5 w-5" /> Add to Planner
                      </Button>
                    </div>
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
