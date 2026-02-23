export interface GroupRule {
  id: string;
  label: string;
  min: number;
  max: number;
  exact?: boolean;
  children?: GroupRule[];
}

export const DEGREE_RULES: GroupRule[] = [
  {
    id: 'A1',
    label: 'Software System Science',
    min: 30,
    max: 69,
    children: [
      { id: 'S1', label: 'Theory', min: 6, max: 30 },
      { id: 'S2', label: 'Systems', min: 6, max: 30 },
      { id: 'S3', label: 'Software', min: 6, max: 30 },
    ],
  },
  { id: 'A2', label: 'Domain-specific', min: 0, max: 39 },
  { id: 'A3', label: 'Seminar & Project', min: 9, max: 9, exact: true },
  { id: 'A4', label: 'Thesis', min: 30, max: 30, exact: true },
  { id: 'A5', label: 'International Experience', min: 12, max: 27 },
];

export const TOTAL_ECTS = 120;

export interface UserModuleWithModule {
  id: string;
  user_id: string;
  module_id: string;
  status: string;
  semester_term: string;
  semester_year: number;
  custom_ects: number | null;
  modules: {
    id: string;
    code: string;
    title: string;
    ects: number;
    module_group: string;
    area: string | null;
    variable_ects: boolean;
    max_ects: number | null;
    frequency: string;
    language: string;
    exam_type: string | null;
    description: string | null;
  };
}

export function getEffectiveEcts(um: UserModuleWithModule): number {
  return um.custom_ects ?? um.modules.ects;
}

export function computeGroupEcts(userModules: UserModuleWithModule[], group: string, area?: string, statusFilter: string[] = ['passed']) {
  return userModules
    .filter(um => um.modules.module_group === group)
    .filter(um => !area || um.modules.area === area)
    .filter(um => statusFilter.includes(um.status))
    .reduce((sum, um) => sum + getEffectiveEcts(um), 0);
}

export interface GroupStatus {
  rule: GroupRule;
  passed: number;
  planned: number;
  total: number;
  status: 'complete' | 'in_progress' | 'below_min' | 'above_max' | 'ok';
  children?: GroupStatus[];
}

export function computeGroupStatuses(userModules: UserModuleWithModule[]): GroupStatus[] {
  return DEGREE_RULES.map(rule => {
    const passed = computeGroupEcts(userModules, rule.id, undefined, ['passed']);
    const planned = computeGroupEcts(userModules, rule.id, undefined, ['planned', 'in_progress']);
    const total = passed + planned;

    let status: GroupStatus['status'] = 'ok';
    if (passed >= rule.min && passed <= rule.max) status = 'complete';
    else if (total >= rule.min && passed < rule.min) status = 'in_progress';
    else if (passed < rule.min && total < rule.min) status = 'below_min';
    if (passed > rule.max || total > rule.max) status = 'above_max';

    const children = rule.children?.map(child => {
      const cp = computeGroupEcts(userModules, rule.id, child.id, ['passed']);
      const cpl = computeGroupEcts(userModules, rule.id, child.id, ['planned', 'in_progress']);
      const ct = cp + cpl;
      let cs: GroupStatus['status'] = 'ok';
      if (cp >= child.min && cp <= child.max) cs = 'complete';
      else if (ct >= child.min && cp < child.min) cs = 'in_progress';
      else if (cp < child.min && ct < child.min) cs = 'below_min';
      if (cp > child.max || ct > child.max) cs = 'above_max';
      return { rule: child, passed: cp, planned: cpl, total: ct, status: cs };
    });

    return { rule, passed, planned, total, status, children };
  });
}

export interface Alert {
  type: 'error' | 'warning' | 'info';
  message: string;
  group?: string;
}

export function generateAlerts(groupStatuses: GroupStatus[]): Alert[] {
  const alerts: Alert[] = [];

  for (const gs of groupStatuses) {
    if (gs.status === 'below_min') {
      alerts.push({
        type: 'error',
        message: `${gs.rule.label} (${gs.rule.id}): ${gs.passed} ECTS passed, need at least ${gs.rule.min}.`,
        group: gs.rule.id,
      });
    }
    if (gs.status === 'above_max') {
      alerts.push({
        type: 'warning',
        message: `${gs.rule.label} (${gs.rule.id}): ${gs.total} ECTS exceeds maximum of ${gs.rule.max}.`,
        group: gs.rule.id,
      });
    }
    if (gs.children) {
      for (const child of gs.children) {
        if (child.status === 'below_min') {
          alerts.push({
            type: 'error',
            message: `${gs.rule.id}/${child.rule.label}: ${child.passed} ECTS passed, need at least ${child.rule.min}.`,
            group: gs.rule.id,
          });
        }
        if (child.status === 'above_max') {
          alerts.push({
            type: 'warning',
            message: `${gs.rule.id}/${child.rule.label}: ${child.total} ECTS exceeds maximum of ${child.rule.max}.`,
            group: gs.rule.id,
          });
        }
      }
    }
  }

  // Check mandatory modules
  const a3 = groupStatuses.find(g => g.rule.id === 'A3');
  if (a3 && a3.passed < 9) {
    if (a3.passed < 3) alerts.push({ type: 'error', message: 'Missing: Master\'s Seminar (3 ECTS required).', group: 'A3' });
    if (a3.passed < 9) alerts.push({ type: 'error', message: 'Missing: Master\'s Project (6 ECTS required).', group: 'A3' });
  }
  const a4 = groupStatuses.find(g => g.rule.id === 'A4');
  if (a4 && a4.passed < 30) {
    alerts.push({ type: 'error', message: 'Missing: Master\'s Thesis (30 ECTS required).', group: 'A4' });
  }

  return alerts;
}

export function generateSuggestions(groupStatuses: GroupStatus[]): string[] {
  const suggestions: string[] = [];
  for (const gs of groupStatuses) {
    if (gs.passed < gs.rule.min) {
      const remaining = gs.rule.min - gs.passed;
      suggestions.push(`Add ${remaining} more ECTS to ${gs.rule.label} (${gs.rule.id}).`);
    }
    if (gs.children) {
      for (const child of gs.children) {
        if (child.passed < child.rule.min) {
          const rem = child.rule.min - child.passed;
          suggestions.push(`Add ${rem} more ECTS to ${child.rule.label} in ${gs.rule.id}.`);
        }
      }
    }
  }
  return suggestions;
}
