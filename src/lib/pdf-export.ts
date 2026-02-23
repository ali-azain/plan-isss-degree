import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { UserModuleWithModule, GroupStatus } from './degree-rules';
import { getEffectiveEcts } from './degree-rules';

interface ProfileData {
  start_semester_term: string;
  start_semester_year: number;
  focus_tag: string | null;
}

export function exportDegreePlanPDF(
  profile: ProfileData,
  userModules: UserModuleWithModule[],
  groupStatuses: GroupStatus[],
  totalPassed: number,
  totalPlanned: number,
  remaining: number,
) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('ISSS Degree Plan Report', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Profile
  doc.setFontSize(12);
  doc.text('Student Profile', 14, 40);
  doc.setFontSize(10);
  doc.text(`Start: ${profile.start_semester_term} ${profile.start_semester_year}`, 14, 48);
  if (profile.focus_tag) doc.text(`Focus: ${profile.focus_tag}`, 14, 54);

  // ECTS Summary
  doc.setFontSize(12);
  doc.text('ECTS Summary', 14, 66);
  doc.setFontSize(10);
  doc.text(`Passed: ${totalPassed} / 120`, 14, 74);
  doc.text(`Planned: ${totalPlanned}`, 14, 80);
  doc.text(`Remaining: ${remaining}`, 14, 86);

  // Requirements
  let y = 98;
  doc.setFontSize(12);
  doc.text('Requirements Checklist', 14, y);
  y += 8;

  const reqRows = groupStatuses.map(gs => [
    gs.rule.id,
    gs.rule.label,
    `${gs.passed}/${gs.rule.min}–${gs.rule.max}`,
    gs.status === 'complete' ? '✓' : gs.status === 'above_max' ? '⚠ Over' : '✗ Incomplete',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Group', 'Name', 'Passed/Range', 'Status']],
    body: reqRows,
    theme: 'striped',
    headStyles: { fillColor: [34, 55, 92] },
  });

  // Passed modules
  const passed = userModules.filter(um => um.status === 'passed');
  if (passed.length > 0) {
    const passedY = (doc as any).lastAutoTable?.finalY + 14 || y + 60;
    doc.setFontSize(12);
    doc.text('Passed Modules', 14, passedY);

    autoTable(doc, {
      startY: passedY + 6,
      head: [['Code', 'Title', 'ECTS', 'Group', 'Semester']],
      body: passed.map(um => [
        um.modules.code,
        um.modules.title,
        getEffectiveEcts(um).toString(),
        um.modules.module_group,
        `${um.semester_term} ${um.semester_year}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [34, 55, 92] },
    });
  }

  // Planned modules
  const planned = userModules.filter(um => um.status === 'planned' || um.status === 'in_progress');
  if (planned.length > 0) {
    const plannedY = (doc as any).lastAutoTable?.finalY + 14 || 180;
    doc.setFontSize(12);
    doc.text('Planned Modules', 14, plannedY);

    autoTable(doc, {
      startY: plannedY + 6,
      head: [['Code', 'Title', 'ECTS', 'Status', 'Semester']],
      body: planned.map(um => [
        um.modules.code,
        um.modules.title,
        getEffectiveEcts(um).toString(),
        um.status,
        `${um.semester_term} ${um.semester_year}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [34, 55, 92] },
    });
  }

  doc.save('isss-degree-plan.pdf');
}
