import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import usePro from '../context/ProContext';
import useChecklist from '../hooks/useChecklist';
import api from '../utils/api';

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

const ActionBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const Btn = styled.button`
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

const DeleteBtn = styled(Btn)`
  &:hover {
    color: ${({ theme }) => theme.colors.warning};
    border-color: ${({ theme }) => theme.colors.warning};
  }
`;

const SavedMsg = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.success};
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
`;

const AddRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
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

const EmptySection = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
  padding: 4px 0;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: 0.95rem;
`;

const Loading = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
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
    if (e.key === 'Enter') commitEdit();
    else if (e.key === 'Escape') {
      setDraft(item.label);
      setEditing(false);
    }
  }

  return (
    <ItemRow>
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
        <LabelText $packed={item.packed} onClick={() => setEditing(true)}>
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

  return (
    <AddRow>
      <AddInput
        placeholder="Add an item..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
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

function getSectionOrder(checklist) {
  const seen = new Set();
  const order = [];
  for (const item of checklist) {
    if (!seen.has(item.section)) {
      seen.add(item.section);
      order.push(item.section);
    }
  }
  return order;
}

// --- Component ---

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPro } = usePro();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isPro) {
      navigate('/unlock', { replace: true });
      return;
    }

    api
      .get(`/plans/${id}`)
      .then(({ data }) => setPlan(data.plan))
      .catch((err) => {
        setError(
          err.response?.status === 404
            ? 'Plan not found.'
            : err.response?.status === 403
              ? 'Access denied.'
              : 'Failed to load plan.'
        );
      })
      .finally(() => setLoading(false));
  }, [id, isPro, navigate]);

  const { items, togglePacked, editLabel, removeItem, addItem } = useChecklist(
    plan?.checklistSnapshot
  );

  const [sectionOrder] = useState(() =>
    plan ? getSectionOrder(plan.checklistSnapshot) : []
  );

  if (!isPro) return null;
  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;
  if (!plan) return <ErrorMsg>Plan not found.</ErrorMsg>;

  const sections = groupBySection(items);
  const order =
    sectionOrder.length > 0
      ? sectionOrder
      : getSectionOrder(plan.checklistSnapshot);

  async function handleSave() {
    try {
      await api.put(`/plans/${id}`, { checklistSnapshot: items });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save changes.');
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this plan? This cannot be undone.')) return;
    try {
      await api.delete(`/plans/${id}`);
      navigate('/plans', { replace: true });
    } catch {
      alert('Failed to delete plan.');
    }
  }

  return (
    <Page>
      <Header>
        <Title>{plan.title}</Title>
        <ActionBar>
          {saved && <SavedMsg>Saved!</SavedMsg>}
          <Btn onClick={handleSave}>Save</Btn>
          <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>
        </ActionBar>
      </Header>

      {order.map((sectionName) => {
        const sectionItems = sections[sectionName] || [];
        return (
          <Section key={sectionName}>
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

      <BackLink to="/plans">&larr; Back to Plans</BackLink>
    </Page>
  );
}
