import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';
import COUNTRIES from '../utils/countries';
import { inferClimateFromStop } from '../utils/climateHeuristics';

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
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 0.95rem;
`;

const PrefillBlurb = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.4;
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

const DropdownChevron = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.65rem;
  z-index: 1;
`;

const DropdownInputStyled = styled(Input)`
  padding-right: 32px;
  cursor: pointer;
`;

const FieldHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const ResetAutoBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0;
  margin-top: 2px;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
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

const InlineError = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.75rem;
  margin-top: 2px;
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

const COUNTRY_LOWER_MAP = new Map(COUNTRIES.map((c) => [c.toLowerCase(), c]));

function isValidCountry(val) {
  return COUNTRY_LOWER_MAP.has(val.trim().toLowerCase());
}

function resolveCanonical(val) {
  return COUNTRY_LOWER_MAP.get(val.trim().toLowerCase()) || null;
}

// --- Autocomplete component ---

function CountryAutocomplete({ value, onCommit, placeholder, inputId }) {
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
      const canonical = resolveCanonical(inputText);
      if (canonical) {
        setInputText(canonical);
        onCommit(canonical);
        prevValue.current = canonical;
      } else {
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
      <DropdownInputStyled
        id={inputId}
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
      <DropdownChevron>&#x25BE;</DropdownChevron>
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

// --- DropdownSelect component (for fixed option lists) ---

function DropdownSelect({ value, onCommit, options, placeholder, inputId }) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption ? selectedOption.label : (placeholder || '');

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

  function selectOption(opt) {
    onCommit(opt.value);
    setOpen(false);
    setHighlightIdx(-1);
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        const currentIdx = options.findIndex((o) => o.value === value);
        setHighlightIdx(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlightIdx >= 0 && highlightIdx < options.length) {
        selectOption(options[highlightIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlightIdx(-1);
    }
  }

  return (
    <AutocompleteWrap ref={wrapRef}>
      <DropdownInputStyled
        id={inputId}
        value={displayText}
        readOnly
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) {
            const currentIdx = options.findIndex((o) => o.value === value);
            setHighlightIdx(currentIdx >= 0 ? currentIdx : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <DropdownChevron>&#x25BE;</DropdownChevron>
      {open && options.length > 0 && (
        <DropdownList ref={listRef}>
          {options.map((opt, i) => (
            <DropdownItem
              key={opt.value === '' ? '__empty__' : opt.value}
              $active={i === highlightIdx}
              onMouseDown={() => selectOption(opt)}
            >
              {opt.label}
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
  rainExpected: null,
};

const CLIMATE_OPTIONS = ['cold', 'moderate', 'hot', 'mixed'];
const LAUNDRY_OPTIONS = ['none', 'weekly', 'frequent'];
const WORK_OPTIONS = ['none', 'light', 'heavy'];
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Step 1 state
  const [citizenship, setCitizenship] = useState('');
  const [stops, setStops] = useState([{ ...EMPTY_STOP }]);
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
    setFieldErrors({});
  }

  function removeStop(index) {
    setStops((prev) => prev.filter((_, i) => i !== index));
    setFieldErrors({});
  }

  function clearFieldError(key) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  // --- Validation ---

  function validateStep1Detailed() {
    const errors = {};
    let firstKey = null;

    function addError(key, msg) {
      if (!errors[key]) {
        errors[key] = msg;
        if (!firstKey) firstKey = key;
      }
    }

    if (!citizenship || !isValidCountry(citizenship)) {
      addError('citizenship', 'Please select a valid country.');
    }

    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      if (!s.countryOrRegion.trim() || !isValidCountry(s.countryOrRegion)) {
        addError(`stop-${i}-country`, 'Please select a valid country.');
      }
      if (!s.startDate) {
        addError(`stop-${i}-startDate`, 'Required.');
      }
      if (!s.endDate) {
        addError(`stop-${i}-endDate`, 'Required.');
      }
      if (s.startDate && s.endDate && s.endDate < s.startDate) {
        addError(`stop-${i}-endDate`, 'End date must be on or after start date.');
      }
    }

    if (!gender) {
      addError('gender', 'Please select a gender.');
    }

    return { errors, firstKey };
  }

  function validateStep2() {
    if (!bagLiters || bagLiters <= 0) {
      return 'Bag size must be greater than 0.';
    }
    return '';
  }

  // --- Navigation ---

  function goToStep2() {
    const { errors, firstKey } = validateStep1Detailed();
    setFieldErrors(errors);
    if (firstKey) {
      setError('');
      requestAnimationFrame(() => {
        const el = document.getElementById(`field-${firstKey}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus?.();
        }
      });
      return;
    }
    setError('');
    setFieldErrors({});
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
      citizenship: citizenship.trim(),
      stops: stops.map((s) => ({
        countryOrRegion: s.countryOrRegion.trim(),
        startDate: s.startDate,
        endDate: s.endDate,
        climateOverride: s.climateOverride || null,
        rainExpected: s.rainExpected,
      })),
      bagLiters: Number(bagLiters),
      laundry,
      workSetup,
      gender,
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
        <PrefillBlurb>
          We prefill climate and rain expectations based on your destination and
          travel dates. This is a best-guess estimate, but you can override it at
          any time.
        </PrefillBlurb>

        <Card>
          <CardLabel>Citizenship (passport issuer)</CardLabel>
          <CountryAutocomplete
            value={citizenship}
            onCommit={(val) => { setCitizenship(val); clearFieldError('citizenship'); }}
            placeholder="e.g. United States"
            inputId="field-citizenship"
          />
          {fieldErrors.citizenship && <InlineError>{fieldErrors.citizenship}</InlineError>}
        </Card>

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
                  onCommit={(val) => { updateStop(i, 'countryOrRegion', val); clearFieldError(`stop-${i}-country`); }}
                  placeholder="e.g. France"
                  inputId={`field-stop-${i}-country`}
                />
                {fieldErrors[`stop-${i}-country`] && <InlineError>{fieldErrors[`stop-${i}-country`]}</InlineError>}
              </Field>
            </Row>
            <Row>
              <Field>
                Start Date
                <DateInput
                  id={`field-stop-${i}-startDate`}
                  type="date"
                  value={s.startDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateStop(i, 'startDate', val);
                    clearFieldError(`stop-${i}-startDate`);
                    clearFieldError(`stop-${i}-endDate`);
                    if (val && s.endDate && s.endDate < val) {
                      updateStop(i, 'endDate', val);
                    }
                  }}
                  onClick={(e) => e.target.showPicker?.()}
                />
                {fieldErrors[`stop-${i}-startDate`] && <InlineError>{fieldErrors[`stop-${i}-startDate`]}</InlineError>}
              </Field>
              <Field>
                End Date
                <DateInput
                  id={`field-stop-${i}-endDate`}
                  type="date"
                  min={s.startDate || undefined}
                  value={s.endDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateStop(i, 'endDate', val);
                    clearFieldError(`stop-${i}-startDate`);
                    clearFieldError(`stop-${i}-endDate`);
                    if (s.startDate && val && val < s.startDate) {
                      setFieldErrors((prev) => ({ ...prev, [`stop-${i}-endDate`]: 'End date must be on or after start date.' }));
                    }
                  }}
                  onClick={(e) => e.target.showPicker?.()}
                />
                {fieldErrors[`stop-${i}-endDate`] && <InlineError>{fieldErrors[`stop-${i}-endDate`]}</InlineError>}
              </Field>
            </Row>
            <Row>
              <Field>
                Climate override
                <DropdownSelect
                  value={s.climateOverride}
                  onCommit={(val) => updateStop(i, 'climateOverride', val)}
                  options={[
                    { value: '', label: (() => { const inf = inferClimateFromStop(s); return inf ? `Auto (${inf.climate})` : 'Auto (based on destination + dates)'; })() },
                    ...CLIMATE_OPTIONS.map((c) => ({ value: c, label: c })),
                  ]}
                  placeholder="Select climate"
                />
                {(() => {
                  const inf = inferClimateFromStop(s);
                  const inferredRain = inf ? inf.rainExpected : false;
                  const isAuto = s.rainExpected === null;
                  const effectiveChecked = s.rainExpected === true || (isAuto && inferredRain);

                  return (
                    <>
                      <CheckboxRow>
                        <CheckboxInput
                          type="checkbox"
                          checked={effectiveChecked}
                          onChange={() => {
                            updateStop(i, 'rainExpected', effectiveChecked ? false : true);
                          }}
                        />
                        Rain expected
                      </CheckboxRow>
                      {s.rainExpected !== null && (
                        <ResetAutoBtn type="button" onClick={() => updateStop(i, 'rainExpected', null)}>
                          Reset to Auto
                        </ResetAutoBtn>
                      )}
                      {!s.climateOverride && inf && (
                        <FieldHint>
                          Auto: {inf.climate}{isAuto && inferredRain ? ', rain expected' : ''}
                        </FieldHint>
                      )}
                    </>
                  );
                })()}
              </Field>
            </Row>
          </Card>
        ))}

        <TextBtn onClick={addStop}>+ Add another stop</TextBtn>

        <Card style={{ marginTop: '16px' }}>
          <CardLabel>Gender</CardLabel>
          <div id="field-gender">
            <PillRow>
              {GENDER_OPTIONS.map((g) => (
                <GenderPill
                  key={g.value}
                  type="button"
                  $active={gender === g.value}
                  onClick={() => { setGender(g.value); clearFieldError('gender'); }}
                >
                  {g.label}
                </GenderPill>
              ))}
            </PillRow>
            {fieldErrors.gender && <InlineError>{fieldErrors.gender}</InlineError>}
          </div>
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
              onBlur={(e) => {
                const val = e.target.value.replace(/,/g, '').trim();
                if (val && !mustBringItems.some((t) => t.toLowerCase() === val.toLowerCase())) {
                  setMustBringItems((prev) => [...prev, val]);
                }
                e.target.value = '';
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
            <DropdownSelect
              value={laundry}
              onCommit={(val) => setLaundry(val)}
              options={LAUNDRY_OPTIONS.map((l) => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) }))}
              placeholder="Select laundry access"
            />
          </Field>
          <Field>
            Work Setup
            <DropdownSelect
              value={workSetup}
              onCommit={(val) => setWorkSetup(val)}
              options={WORK_OPTIONS.map((w) => ({ value: w, label: w.charAt(0).toUpperCase() + w.slice(1) }))}
              placeholder="Select work setup"
            />
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
