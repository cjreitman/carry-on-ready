import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';
import COUNTRIES from '../utils/countries';

// --- Styled pieces ---

const Page = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

const StepTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StepSub = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.95rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: ${({ $flex }) => $flex || 1};
  min-width: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
`;

const DateInput = styled(Input)`
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const Select = styled.select`
  padding: 8px 36px 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
`;

const FieldHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Btn = styled.button`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: 600;
  border: none;
`;

const PrimaryBtn = styled(Btn)`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SecondaryBtn = styled(Btn)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  &:hover { background: ${({ theme }) => theme.colors.bgLight}; }
`;

const TextBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.85rem;
  padding: 0;
  align-self: flex-end;
  margin-bottom: 6px;
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.9rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StopLabel = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

// --- Autocomplete styles ---

const AutocompleteWrap = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.li`
  padding: 6px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#fff' : 'inherit')};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  }
`;

// --- Tag input styles ---

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.inputBg};
  min-height: 38px;
  align-items: center;
  cursor: text;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.82rem;
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.9rem;
  flex: 1;
  min-width: 80px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

const CardLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const CardHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// --- Gender pill styles ---

const PillRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const GenderPill = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.colors.text};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// --- Rain checkbox styles ---

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  margin-top: 4px;
`;

const CheckboxInput = styled.input`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

// --- Country set for fast lookup ---

const COUNTRY_SET = new Set(COUNTRIES.map((c) => c.toLowerCase()));

function isValidCountry(val) {
  return COUNTRY_SET.has(val.trim().toLowerCase());
}

// --- Autocomplete component ---

function CountryAutocomplete({ value, onCommit, placeholder }) {
  const [inputText, setInputText] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  // Sync inputText when value changes externally (e.g. stop removed)
  const prevValue = useRef(value);
  useEffect(() => {
    if (value !== prevValue.current) {
      setInputText(value);
      prevValue.current = value;
    }
  }, [value]);

  const filtered = inputText.trim()
    ? COUNTRIES.filter((c) =>
        c.toLowerCase().includes(inputText.toLowerCase())
      ).slice(0, 50)
    : COUNTRIES;

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIdx];
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIdx]);

  function selectCountry(country) {
    setInputText(country);
    onCommit(country);
    prevValue.current = country;
    setOpen(false);
    setHighlightIdx(-1);
  }

  function handleBlur() {
    // Delay to allow mousedown on dropdown items to fire first
    setTimeout(() => {
      if (!isValidCountry(inputText)) {
        setInputText('');
        onCommit('');
        prevValue.current = '';
      }
      setOpen(false);
    }, 150);
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setOpen(true);
        setHighlightIdx(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIdx >= 0 && highlightIdx < filtered.length) {
        selectCountry(filtered[highlightIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlightIdx(-1);
    }
  }

  return (
    <AutocompleteWrap ref={wrapRef}>
      <Input
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          // Clear committed value while typing
          if (value) {
            onCommit('');
            prevValue.current = '';
          }
          setOpen(true);
          setHighlightIdx(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <DropdownList ref={listRef}>
          {filtered.map((c, i) => (
            <DropdownItem
              key={c}
              $active={i === highlightIdx}
              onMouseDown={() => selectCountry(c)}
            >
              {c}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </AutocompleteWrap>
  );
}

// --- Defaults ---

const EMPTY_STOP = {
  countryOrRegion: '',
  startDate: '',
  endDate: '',
  climateOverride: '',
  rainExpected: false,
};

const CLIMATE_OPTIONS = ['cold', 'moderate', 'hot', 'mixed'];
const LAUNDRY_OPTIONS = ['none', 'weekly', 'frequent'];
const WORK_OPTIONS = ['none', 'light', 'heavy'];
const PASSPORT_OPTIONS = ['US', 'EU', 'UK', 'other'];
const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

// --- Component ---

export default function Build() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Step 1 state
  const [stops, setStops] = useState([{ ...EMPTY_STOP }]);
  const [passportRegion, setPassportRegion] = useState('US');
  const [schengenDays, setSchengenDays] = useState(0);
  const [gender, setGender] = useState('');
  const [mustBringItems, setMustBringItems] = useState([]);

  // Step 2 state
  const [bagLiters, setBagLiters] = useState(35);
  const [laundry, setLaundry] = useState('none');
  const [workSetup, setWorkSetup] = useState('none');

  // --- Stop helpers ---

  function updateStop(index, field, value) {
    setStops((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addStop() {
    setStops((prev) => [...prev, { ...EMPTY_STOP }]);
  }

  function removeStop(index) {
    setStops((prev) => prev.filter((_, i) => i !== index));
  }

  // --- Validation ---

  function validateStep1() {
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      if (!s.countryOrRegion.trim() || !isValidCountry(s.countryOrRegion)) {
        return `Stop ${i + 1}: Please select a valid country from the list.`;
      }
      if (!s.startDate || !s.endDate) {
        return `Stop ${i + 1}: Start and end dates are required.`;
      }
      if (s.endDate < s.startDate) {
        return `Stop ${i + 1}: End date must be on or after start date.`;
      }
    }
    if (!gender) {
      return 'Please select a gender option.';
    }
    return '';
  }

  function validateStep2() {
    if (!bagLiters || bagLiters <= 0) {
      return 'Bag size must be greater than 0.';
    }
    return '';
  }

  // --- Navigation ---

  function goToStep2() {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(2);
  }

  function goBackToStep1() {
    setError('');
    setStep(1);
  }

  // --- Submit ---

  async function handleGenerate() {
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setSubmitting(true);

    const payload = {
      stops: stops.map((s) => ({
        countryOrRegion: s.countryOrRegion.trim(),
        startDate: s.startDate,
        endDate: s.endDate,
        climateOverride: s.climateOverride || null,
        rainExpected: s.rainExpected || false,
      })),
      bagLiters: Number(bagLiters),
      laundry,
      workSetup,
      gender,
      passportRegion,
      schengenDaysUsedLast180: Number(schengenDays),
      mustBringItems: mustBringItems.length > 0 ? mustBringItems : undefined,
    };

    try {
      const { data } = await api.post('/generate', payload);
      navigate('/results', { state: { result: data, inputs: payload } });
    } catch (e) {
      console.log(e)
      const msg =
        e.response?.data?.errors?.[0]?.message ||
        e.response?.data?.error ||
        'Something went wrong. Check your inputs and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // --- Render ---

  if (step === 1) {
    return (
      <Page>
        <StepTitle>Step 1: Your Trip</StepTitle>
        <StepSub>Add one or more stops to your itinerary.</StepSub>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        {stops.map((s, i) => (
          <Card key={i}>
            <StopHeader>
              <StopLabel>Stop {i + 1}</StopLabel>
              {stops.length > 1 && (
                <RemoveBtn onClick={() => removeStop(i)}>Remove</RemoveBtn>
              )}
            </StopHeader>
            <Row>
              <Field $flex={2}>
                Country / Region
                <CountryAutocomplete
                  value={s.countryOrRegion}
                  onCommit={(val) => updateStop(i, 'countryOrRegion', val)}
                  placeholder="e.g. France"
                />
              </Field>
              <Field>
                Climate override (optional)
                <Select
                  value={s.climateOverride}
                  onChange={(e) =>
                    updateStop(i, 'climateOverride', e.target.value)
                  }
                >
                  <option value="">—</option>
                  {CLIMATE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
                <CheckboxRow>
                  <CheckboxInput
                    type="checkbox"
                    checked={s.rainExpected}
                    onChange={(e) =>
                      updateStop(i, 'rainExpected', e.target.checked)
                    }
                  />
                  Rain expected
                </CheckboxRow>
              </Field>
            </Row>
            <Row>
              <Field>
                Start Date
                <DateInput
                  type="date"
                  value={s.startDate}
                  onChange={(e) => updateStop(i, 'startDate', e.target.value)}
                  onClick={(e) => e.target.showPicker?.()}
                />
              </Field>
              <Field>
                End Date
                <DateInput
                  type="date"
                  value={s.endDate}
                  onChange={(e) => updateStop(i, 'endDate', e.target.value)}
                  onClick={(e) => e.target.showPicker?.()}
                />
              </Field>
            </Row>
          </Card>
        ))}

        <TextBtn onClick={addStop}>+ Add another stop</TextBtn>

        <Card style={{ marginTop: '16px' }}>
          <Row>
            <Field>
              Passport Region
              <Select
                value={passportRegion}
                onChange={(e) => setPassportRegion(e.target.value)}
              >
                {PASSPORT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              Schengen Days Used (last 180 days)
              <Input
                type="number"
                min={0}
                max={90}
                value={schengenDays}
                onChange={(e) => setSchengenDays(e.target.value)}
              />
            </Field>
          </Row>
        </Card>

        <Card style={{ marginTop: '16px' }}>
          <CardLabel>Gender</CardLabel>
          <PillRow>
            {GENDER_OPTIONS.map((g) => (
              <GenderPill
                key={g.value}
                type="button"
                $active={gender === g.value}
                onClick={() => setGender(g.value)}
              >
                {g.label}
              </GenderPill>
            ))}
          </PillRow>
        </Card>

        <Card style={{ marginTop: '16px' }}>
          <CardLabel>Must-bring items (optional)</CardLabel>
          <CardHint>
            Add any event-specific or required gear (e.g. skates, wedding outfit, running shoes).
          </CardHint>
          <TagWrap onClick={(e) => {
            const input = e.currentTarget.querySelector('input');
            if (input) input.focus();
          }}>
            {mustBringItems.map((item) => (
              <Tag key={item}>
                {item}
                <TagRemove
                  onClick={(e) => {
                    e.stopPropagation();
                    setMustBringItems((prev) => prev.filter((t) => t !== item));
                  }}
                >
                  &times;
                </TagRemove>
              </Tag>
            ))}
            <TagInput
              placeholder={mustBringItems.length === 0 ? 'Type and press Enter' : ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const val = e.target.value.replace(/,/g, '').trim();
                  if (val && !mustBringItems.some((t) => t.toLowerCase() === val.toLowerCase())) {
                    setMustBringItems((prev) => [...prev, val]);
                  }
                  e.target.value = '';
                } else if (e.key === 'Backspace' && !e.target.value && mustBringItems.length > 0) {
                  setMustBringItems((prev) => prev.slice(0, -1));
                }
              }}
            />
          </TagWrap>
        </Card>

        <ButtonRow>
          <PrimaryBtn onClick={goToStep2}>Continue</PrimaryBtn>
        </ButtonRow>
      </Page>
    );
  }

  // Step 2
  return (
    <Page>
      <StepTitle>Step 2: Your Constraints</StepTitle>
      <StepSub>Tell us about your bag and preferences.</StepSub>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <Card>
        <Row>
          <Field>
            Bag Size (liters)
            <Input
              type="number"
              min={1}
              value={bagLiters}
              onChange={(e) => setBagLiters(e.target.value)}
            />
          </Field>
        </Row>
        <Row>
          <Field>
            Laundry Access
            <Select
              value={laundry}
              onChange={(e) => setLaundry(e.target.value)}
            >
              {LAUNDRY_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            Work Setup
            <Select
              value={workSetup}
              onChange={(e) => setWorkSetup(e.target.value)}
            >
              {WORK_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
          </Field>
        </Row>
      </Card>

      <ButtonRow>
        <SecondaryBtn onClick={goBackToStep1}>Back</SecondaryBtn>
        <PrimaryBtn onClick={handleGenerate} disabled={submitting}>
          {submitting ? 'Generating...' : 'Generate My Carry-On Plan'}
        </PrimaryBtn>
      </ButtonRow>
    </Page>
  );
}
