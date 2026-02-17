import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import useChecklist from '../hooks/useChecklist';
import usePro from '../context/ProContext';
import { copyChecklistToClipboard, printChecklist } from '../utils/export';
import api from '../utils/api';

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

const CountBadge = styled.span`
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
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

// --- Subcomponents ---

function EditableItem({ item, onToggle, onEdit, onRemove }) {
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

  return (
    <ItemRow data-print-row>
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
        </LabelText>
      )}
      {item.count > 1 && <CountBadge>x{item.count}</CountBadge>}
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

  const { items, togglePacked, editLabel, removeItem, addItem } = useChecklist(
    result?.checklist
  );

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Keep stable section order from original generation
  const [sectionOrder] = useState(() =>
    result ? getSectionOrder(result.checklist) : []
  );

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
                />
              ))
            )}
            <AddItemRow section={sectionName} onAdd={addItem} />
          </Section>
        );
      })}

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
