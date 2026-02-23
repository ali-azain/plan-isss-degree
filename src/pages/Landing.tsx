import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, CalendarDays, FileDown, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: CheckCircle2,
    title: 'Degree Audit',
    desc: 'Track all ECTS requirements across module groups with real-time validation.',
  },
  {
    icon: CalendarDays,
    title: 'Semester Planner',
    desc: 'Organize your modules by semester and see your study path at a glance.',
  },
  {
    icon: FileDown,
    title: 'Export PDF',
    desc: 'Generate a clean PDF report of your degree plan to share with advisors.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">IS</span>
          </div>
          <span className="font-semibold text-foreground text-lg">ISSS Planner</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            Otto-Friedrich-Universität Bamberg
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Plan your ISSS degree.{' '}
            <span className="text-primary">Track ECTS.</span>{' '}
            Avoid mistakes.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The smart degree planner for Master's students in International Software Systems Science.
            Know exactly where you stand — always.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? '/dashboard' : '/auth?signup=true'}>
              <Button size="lg" className="gap-2 px-8">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={user ? '/catalog' : '/auth'}>
              <Button size="lg" variant="outline" className="px-8">
                Browse Modules
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Screenshot mock */}
      <section className="px-6 max-w-5xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl bg-card border border-border p-6 md:p-10 card-shadow"
        >
          <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Dashboard Preview</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-xl bg-card border border-border p-6 card-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        ISSS Degree Planner · Otto-Friedrich-Universität Bamberg
      </footer>
    </div>
  );
}
