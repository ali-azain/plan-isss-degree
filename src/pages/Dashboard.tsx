import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { EctsProgressBar } from '@/components/EctsProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { useUserModules } from '@/hooks/useModules';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { computeGroupStatuses, generateAlerts, generateSuggestions, TOTAL_ECTS, getEffectiveEcts, type UserModuleWithModule } from '@/lib/degree-rules';
import { exportDegreePlanPDF } from '@/lib/pdf-export';
import { AlertTriangle, CheckCircle2, FileDown, Lightbulb, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeItem = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: userModules, isLoading: modulesLoading } = useUserModules();

  const ums = (userModules || []) as unknown as UserModuleWithModule[];

  const totalPassed = useMemo(() => ums.filter(um => um.status === 'passed').reduce((s, um) => s + getEffectiveEcts(um), 0), [ums]);
  const totalPlanned = useMemo(() => ums.filter(um => um.status === 'planned' || um.status === 'in_progress').reduce((s, um) => s + getEffectiveEcts(um), 0), [ums]);
  const remaining = Math.max(0, TOTAL_ECTS - totalPassed);

  const groupStatuses = useMemo(() => computeGroupStatuses(ums), [ums]);
  const alerts = useMemo(() => generateAlerts(groupStatuses), [groupStatuses]);
  const suggestions = useMemo(() => generateSuggestions(groupStatuses), [groupStatuses]);

  const loading = profileLoading || modulesLoading;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const handleExport = () => {
    if (!profile) return;
    exportDegreePlanPDF(profile, ums, groupStatuses, totalPassed, totalPlanned, remaining);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Track your ISSS degree progress</p>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2 self-start">
            <FileDown className="h-4 w-4" /> Export PDF
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Passed ECTS', value: totalPassed, icon: CheckCircle2, color: 'text-success' },
            { label: 'Planned / In Progress', value: totalPlanned, icon: TrendingUp, color: 'text-info' },
            { label: 'Remaining', value: remaining, icon: AlertTriangle, color: 'text-warning' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeItem}
              className="rounded-xl bg-card border border-border p-5 card-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <card.icon className={`h-5 w-5 ${card.color}`} />
                <span className="text-sm text-muted-foreground">{card.label}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Big Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card border border-border p-6 card-shadow"
        >
          <EctsProgressBar value={totalPassed} max={TOTAL_ECTS} label="Graduation Progress" size="lg" />
          <p className="text-sm text-muted-foreground mt-2">
            {totalPassed >= TOTAL_ECTS ? '🎉 Congratulations! You\'ve met the ECTS requirement!' : `${remaining} ECTS remaining to reach ${TOTAL_ECTS}.`}
          </p>
        </motion.div>

        {/* Requirements Checklist */}
        <div className="rounded-xl bg-card border border-border p-6 card-shadow">
          <h2 className="text-lg font-semibold text-foreground mb-4">Requirements</h2>
          <div className="space-y-4">
            {groupStatuses.map((gs, i) => (
              <motion.div key={gs.rule.id} custom={i} initial="hidden" animate="visible" variants={fadeItem}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-medium text-muted-foreground">{gs.rule.id}</span>
                    <span className="text-sm font-medium text-foreground">{gs.rule.label}</span>
                    <StatusBadge status={gs.status} />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {gs.passed}/{gs.rule.min}–{gs.rule.max}
                  </span>
                </div>
                <EctsProgressBar value={gs.passed} max={gs.rule.max} showValue={false} size="sm" />
                {gs.children && (
                  <div className="ml-6 mt-2 space-y-2">
                    {gs.children.map(child => (
                      <div key={child.rule.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{child.rule.id}</span>
                          <span className="text-xs text-foreground">{child.rule.label}</span>
                          <StatusBadge status={child.status} className="text-[10px] px-1.5 py-0" />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {child.passed}/{child.rule.min}–{child.rule.max}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alerts & Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.length > 0 && (
            <div className="rounded-xl bg-card border border-border p-6 card-shadow">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" /> Alerts
              </h2>
              <div className="space-y-2">
                {alerts.map((a, i) => (
                  <div key={i} className={`text-sm p-2.5 rounded-lg ${a.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                    {a.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="rounded-xl bg-card border border-border p-6 card-shadow">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" /> Suggestions
              </h2>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="text-sm p-2.5 rounded-lg bg-info/10 text-info">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
