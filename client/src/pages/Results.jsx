import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import useChecklist from '../hooks/useChecklist';
import usePro from '../context/ProContext';
import { copyChecklistToClipboard, printChecklist } from '../utils/export';
import api from '../utils/api';
import InfoTooltip from '../components/InfoTooltip';

// --- Tooltip copy ---

const ITEM_TOOLTIPS = {
  'clothing-shoes':
    'If packing a second pair for running, choose minimalist or collapsible shoes to reduce bulk.',
  'clothing-shirts':
    'Merino wool resists odor, allowing fewer shirts for longer trips.',
  'clothing-underwear':
    'Quick-dry fabrics allow sink washing and overnight drying.',
  'clothing-socks':
    'Merino socks dry fast and reduce odor over multi-day wear.',
  'health-toiletries':
    'Use 100ml TSA-compliant containers to stay carry-on legal.',
  'res-packbags':
    'Compression packing cubes can reduce volume by 20–30%.',
};

// --- Styled pieces ---

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 1.5rem;
`;

const ExportBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const ExportBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 6px 14px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.textLight};
  }
`;

const CopiedMsg = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.success};
`;

const SummaryBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SummaryItem = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SummaryNote = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// --- Capacity bar ---

const CapacityWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media print {
    display: none;
  }
`;

const CapacityLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.textLight};

  strong {
    color: ${({ $state, theme }) =>
      $state === 'danger'
        ? theme.colors.warning
        : $state === 'warning'
        ? '#e8a735'
        : theme.colors.text};
  }
`;

const CapacityTrack = styled.div`
  height: 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const CapacityFill = styled.div`
  height: 100%;
  border-radius: 5px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $state, theme }) =>
    $state === 'danger'
      ? theme.colors.warning
      : $state === 'warning'
      ? '#e8a735'
      : theme.colors.success};
  transition: width 0.3s ease;
`;

const CapacityHint = styled.div`
  font-size: 0.75rem;
  color: ${({ $state, theme }) =>
    $state === 'danger' ? theme.colors.warning : theme.colors.textLight};
  margin-top: 3px;
`;

const WarningBox = styled.div`
  background: ${({ theme }) => theme.colors.warningBg};
  border-left: 3px solid ${({ theme }) => theme.colors.warning};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: 0 ${({ theme }) => theme.borderRadius}
    ${({ theme }) => theme.borderRadius} 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.warning};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 6px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.95rem;
  background: ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.warningBg : 'transparent'};
  margin: ${({ $highlighted }) => ($highlighted ? '0 -8px' : '0')};
  padding-left: ${({ $highlighted }) => ($highlighted ? '8px' : '0')};
  padding-right: ${({ $highlighted }) => ($highlighted ? '8px' : '0')};
  border-radius: ${({ $highlighted }) => ($highlighted ? '4px' : '0')};

  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;

  @media print {
    display: none;
  }
`;

const LabelText = styled.span`
  flex: 1;
  min-width: 0;
  cursor: pointer;
  text-decoration: ${({ $packed }) => ($packed ? 'line-through' : 'none')};
  color: ${({ $packed, theme }) =>
    $packed ? theme.colors.textLight : theme.colors.text};
`;

const LabelInput = styled.input`
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
  padding: 2px 6px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  outline: none;
`;

const CountStepperWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;

  @media print {
    display: none;
  }
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: none;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.8rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const CountNumber = styled.span`
  min-width: 20px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
`;

const PrintCount = styled.span`
  display: none;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  flex-shrink: 0;

  @media print {
    display: inline;
  }
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  line-height: 1;
  padding: 0 2px;
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.warning};
  }

  @media print {
    display: none;
  }
`;

const VolumeHint = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textLight};
  flex-shrink: 0;
  white-space: nowrap;

  @media print {
    display: none;
  }
`;

const EmptySection = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
  padding: 4px 0;
`;

const AddRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media print {
    display: none;
  }
`;

const AddInput = styled.input`
  flex: 1;
  font-size: 0.9rem;
  padding: 5px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const AddBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const NoteBox = styled.div`
  background: ${({ theme }) => theme.colors.successBg};
  border-left: 3px solid ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: 0 ${({ theme }) => theme.borderRadius}
    ${({ theme }) => theme.borderRadius} 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const NoteList = styled.ul`
  margin: 0;
  padding-left: 18px;
  list-style: disc;
`;

const NoteListItem = styled.li`
  margin-bottom: 2px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PrincipleItem = styled.div`
  padding: 5px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};

  &:last-child {
    border-bottom: none;
  }
`;

const NoteFooter = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.md};
`;

const ProHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const EmptyTitle = styled.h1`
  font-size: 1.4rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// --- Add-on styles ---

const AddOnSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AddOnToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
`;

const AddOnRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 6px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
`;

const AddOnLabel = styled.span`
  flex: 1;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const AddOnBtn = styled.button`
  background: none;
  border: 1px solid ${({ $added, theme }) =>
    $added ? theme.colors.border : theme.colors.primary};
  border-radius: 4px;
  padding: 3px 12px;
  font-size: 0.8rem;
  color: ${({ $added, theme }) =>
    $added ? theme.colors.textLight : theme.colors.primary};
  cursor: ${({ $added }) => ($added ? 'default' : 'pointer')};
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${({ $added, theme }) =>
      $added ? 'transparent' : theme.colors.bgLight};
  }
`;

const LowCountWarn = styled.span`
  @media print {
    display: none;
  }
`;

// --- Subcomponents ---

function EditableItem({ item, onToggle, onEdit, onRemove, onSetCount, tooltip, highlighted }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.label) {
      onEdit(item.id, trimmed);
    } else {
      setDraft(item.label);
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      setDraft(item.label);
      setEditing(false);
    }
  }

  const count = item.count ?? 1;
  const volEach = item.volumeEachLiters ?? 0.2;
  const volTotal = +(volEach * count).toFixed(1);

  const LOW_COUNT_IDS = new Set(['clothing-underwear', 'clothing-socks', 'clothing-shirts']);
  const showLowWarn = LOW_COUNT_IDS.has(item.id) && count > 0 && count < 3;

  return (
    <ItemRow data-print-row $highlighted={highlighted}>
      <Checkbox
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggle(item.id)}
      />
      {editing ? (
        <LabelInput
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <LabelText
          $packed={item.packed}
          onClick={() => setEditing(true)}
        >
          {item.label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </LabelText>
      )}
      <VolumeHint title={`Volume source: ${item.volumeSource || 'default'}`}>
        {volTotal}L
      </VolumeHint>
      <CountStepperWrap>
        <StepButton
          aria-label="Decrease count"
          disabled={count <= 0}
          onClick={() => onSetCount(item.id, count - 1)}
        >
          &minus;
        </StepButton>
        <CountNumber>{count}</CountNumber>
        <StepButton
          aria-label="Increase count"
          onClick={() => onSetCount(item.id, count + 1)}
        >
          +
        </StepButton>
        {showLowWarn && (
          <LowCountWarn>
            <InfoTooltip text="Reducing below 3 may require daily washing." />
          </LowCountWarn>
        )}
      </CountStepperWrap>
      {count > 1 && <PrintCount>x{count}</PrintCount>}
      <RemoveBtn onClick={() => onRemove(item.id)} title="Remove item">
        &times;
      </RemoveBtn>
    </ItemRow>
  );
}

function AddItemRow({ section, onAdd }) {
  const [value, setValue] = useState('');

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(section, trimmed);
    setValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <AddRow>
      <AddInput
        placeholder="Add an item..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <AddBtn onClick={handleAdd}>Add</AddBtn>
    </AddRow>
  );
}

// --- Helpers ---

function groupBySection(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.section]) groups[item.section] = [];
    groups[item.section].push(item);
  }
  return groups;
}

// Preserve section ordering from the original checklist
function getSectionOrder(originalChecklist) {
  const seen = new Set();
  const order = [];
  for (const item of originalChecklist) {
    if (!seen.has(item.section)) {
      seen.add(item.section);
      order.push(item.section);
    }
  }
  return order;
}

// --- Component ---

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPro } = usePro();
  const result = location.state?.result;
  const inputs = location.state?.inputs;

  const { items, togglePacked, editLabel, removeItem, addItem, addFullItem, setCount, totalVolume } = useChecklist(
    result?.checklist
  );

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addOnsExpanded, setAddOnsExpanded] = useState(true);
  const [optionalAddOns] = useState(() => result?.optionalAddOns || []);

  // Derive which add-on IDs are already in the checklist
  const checklistIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  // Keep stable section order from original generation
  const [sectionOrder] = useState(() =>
    result ? getSectionOrder(result.checklist) : []
  );

  // Volume / capacity derived values
  const usableCapacity = result ? +(result.derived?.usableCapacityLiters || (inputs?.bagLiters * 0.85)).toFixed(1) : 0;
  const percentUsed = usableCapacity > 0 ? Math.round((totalVolume / usableCapacity) * 100) : 0;
  const capacityState = percentUsed > 100 ? 'danger' : percentUsed >= 90 ? 'warning' : 'normal';
  const overBy = capacityState === 'danger' ? +(totalVolume - usableCapacity).toFixed(1) : 0;

  // When over capacity, find top 3 highest-volume items to highlight
  const highlightIds = useMemo(() => {
    if (capacityState !== 'danger') return new Set();
    const sorted = [...items]
      .map((it) => ({
        id: it.id,
        vol: (it.volumeEachLiters ?? 0.2) * (it.count ?? 1),
        isUser: !!it.isUserAdded,
      }))
      .sort((a, b) => b.vol - a.vol);
    const ids = new Set();
    // Always highlight user-added items
    for (const s of sorted) {
      if (s.isUser) ids.add(s.id);
    }
    // Add top 3 by volume
    for (const s of sorted) {
      if (ids.size >= 3) break;
      ids.add(s.id);
    }
    return ids;
  }, [items, capacityState]);

  if (!result) {
    return (
      <EmptyState>
        <EmptyTitle>No checklist to show</EmptyTitle>
        <p>Build your itinerary first to generate a packing plan.</p>
        <BackLink to="/build">Go to Build</BackLink>
      </EmptyState>
    );
  }

  const { notes, warnings, derived } = result;
  const sections = groupBySection(items);

  async function handleCopy() {
    if (!isPro) {
      navigate('/unlock');
      return;
    }
    await copyChecklistToClipboard(items, derived, inputs, notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    if (!isPro) {
      navigate('/unlock');
      return;
    }
    printChecklist();
  }

  function handleAddOn(addon) {
    if (checklistIds.has(addon.id)) return;
    addFullItem({ ...addon, isAddOn: true });
  }

  async function handleSave() {
    const title = window.prompt('Name this plan:', `Trip — ${derived.totalDays} days`);
    if (!title) return;

    try {
      await api.post('/plans', {
        title,
        inputs,
        checklistSnapshot: items,
        rulesVersion: result.rulesVersion,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save plan. Please try again.');
    }
  }

  // Split notes
  const principleIdx = notes.indexOf('--- Carry-on Principles ---');
  const rawTips = principleIdx >= 0 ? notes.slice(0, principleIdx) : notes;
  const principleNotes =
    principleIdx >= 0 ? notes.slice(principleIdx + 1) : [];
  const schengenEstLine = rawTips.find((n) => n.startsWith('Schengen 90/180'));
  const tipNotes = rawTips.filter((n) => !n.startsWith('Schengen 90/180'));

  return (
    <Page>
      <Header>
        <Title>Your Packing Checklist</Title>
        <ExportBar data-print-hide>
          {copied && <CopiedMsg>Copied!</CopiedMsg>}
          {saved && <CopiedMsg>Saved!</CopiedMsg>}
          {!isPro && <ProHint>Unlock Pro to export</ProHint>}
          <ExportBtn onClick={handleCopy}>Copy</ExportBtn>
          <ExportBtn onClick={handlePrint}>Print</ExportBtn>
          {isPro && <ExportBtn onClick={handleSave}>Save</ExportBtn>}
        </ExportBar>
      </Header>

      {/* Summary */}
      <SummaryBar>
        <SummaryItem>
          Bag: <strong>{inputs?.bagLiters}L</strong> ({derived.bagTier})
        </SummaryItem>
        <SummaryItem>
          Trip: <strong>{derived.totalDays} days</strong>
        </SummaryItem>
        {derived.schengenApplies && derived.estimatedSchengenTotal != null && (
          <SummaryItem>
            Schengen usage:{' '}
            <strong>{derived.estimatedSchengenTotal} / 90 days</strong> (est.)
          </SummaryItem>
        )}
      </SummaryBar>
      <SummaryNote>Counts already capped for your bag tier.</SummaryNote>

      {/* Capacity bar */}
      <CapacityWrap>
        <CapacityLabel $state={capacityState}>
          <span>Estimated pack volume</span>
          <strong>
            {totalVolume}L / {usableCapacity}L usable ({percentUsed}%)
          </strong>
        </CapacityLabel>
        <CapacityTrack>
          <CapacityFill $pct={percentUsed} $state={capacityState} />
        </CapacityTrack>
        {capacityState === 'danger' && (
          <CapacityHint $state="danger">
            Over by {overBy}L — consider removing or reducing high-volume items highlighted below.
          </CapacityHint>
        )}
        {capacityState === 'warning' && (
          <CapacityHint $state="warning">
            Getting tight — you may want to slim down a few items.
          </CapacityHint>
        )}
      </CapacityWrap>

      {/* Warnings */}
      {warnings.map((w, i) => (
        <WarningBox key={i}>{w}</WarningBox>
      ))}

      {/* Checklist sections */}
      {sectionOrder.map((sectionName) => {
        const sectionItems = sections[sectionName] || [];
        return (
          <Section key={sectionName} data-print-section>
            <SectionTitle>{sectionName}</SectionTitle>
            {sectionItems.length === 0 ? (
              <EmptySection>No items</EmptySection>
            ) : (
              sectionItems.map((item) => (
                <EditableItem
                  key={item.id}
                  item={item}
                  onToggle={togglePacked}
                  onEdit={editLabel}
                  onRemove={removeItem}
                  onSetCount={setCount}
                  tooltip={ITEM_TOOLTIPS[item.id]}
                  highlighted={highlightIds.has(item.id)}
                />
              ))
            )}
            <AddItemRow section={sectionName} onAdd={addItem} />
          </Section>
        );
      })}

      {/* Optional Add-ons */}
      {optionalAddOns.length > 0 && (
        <Section>
          <AddOnSectionHeader>
            <SectionTitle style={{ marginBottom: 0 }}>Optional Add-ons</SectionTitle>
            <AddOnToggle onClick={() => setAddOnsExpanded((v) => !v)}>
              {addOnsExpanded ? 'Hide' : 'Show'}
            </AddOnToggle>
          </AddOnSectionHeader>
          {addOnsExpanded &&
            optionalAddOns.map((addon) => {
              const added = checklistIds.has(addon.id);
              return (
                <AddOnRow key={addon.id}>
                  <AddOnLabel>
                    {addon.label}
                    {addon.tooltip && <InfoTooltip text={addon.tooltip} />}
                  </AddOnLabel>
                  <VolumeHint>{addon.volumeEachLiters}L</VolumeHint>
                  <AddOnBtn
                    $added={added}
                    disabled={added}
                    onClick={() => handleAddOn(addon)}
                  >
                    {added ? 'Added' : 'Add'}
                  </AddOnBtn>
                </AddOnRow>
              );
            })}
        </Section>
      )}

      {/* Tips / notes */}
      {tipNotes.length > 0 && (
        <NoteBox>
          <NoteList>
            {tipNotes.map((n, i) => (
              <NoteListItem key={i}>{n}</NoteListItem>
            ))}
          </NoteList>
        </NoteBox>
      )}
      {schengenEstLine && <NoteFooter>{schengenEstLine}</NoteFooter>}

      {/* Carry-on Principles */}
      {principleNotes.length > 0 && (
        <Section style={{ marginTop: '8px' }} data-print-section>
          <SectionTitle>Carry-On Principles</SectionTitle>
          {principleNotes.map((n, i) => (
            <PrincipleItem key={i} data-print-row>{n}</PrincipleItem>
          ))}
        </Section>
      )}

      <BackLink to="/build" data-print-hide>&larr; Back to Build</BackLink>
    </Page>
  );
}
