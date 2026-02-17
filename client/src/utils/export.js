function groupBySection(items) {
  const groups = {};
  const order = [];
  for (const item of items) {
    if (!groups[item.section]) {
      groups[item.section] = [];
      order.push(item.section);
    }
    groups[item.section].push(item);
  }
  return { groups, order };
}

export function formatChecklistText(items, derived, inputs, notes) {
  const lines = [];

  lines.push('Carry-On Ready — Packing List');
  lines.push(`Bag: ${inputs?.bagLiters}L (${derived.bagTier})`);
  lines.push(`Trip: ${derived.totalDays} days`);
  if (derived.schengenApplies && derived.estimatedSchengenTotal != null) {
    lines.push(`Schengen usage: ${derived.estimatedSchengenTotal} / 90 days (est.)`);
  }
  lines.push('');

  const { groups, order } = groupBySection(items);

  for (const section of order) {
    lines.push(section);
    for (const item of groups[section]) {
      const prefix = item.packed ? '[x]' : '[ ]';
      const count = item.count > 1 ? `${item.count} × ` : '';
      lines.push(`  ${prefix} ${count}${item.label}`);
    }
    lines.push('');
  }

  if (notes && notes.length > 0) {
    // Filter out the principles separator
    const tipNotes = notes.filter(
      (n) => n !== '--- Carry-on Principles ---'
    );
    if (tipNotes.length > 0) {
      lines.push('Notes');
      for (const note of tipNotes) {
        lines.push(`  • ${note}`);
      }
    }
  }

  return lines.join('\n');
}

export async function copyChecklistToClipboard(items, derived, inputs, notes) {
  const text = formatChecklistText(items, derived, inputs, notes);
  await navigator.clipboard.writeText(text);
}

export function printChecklist() {
  window.print();
}
