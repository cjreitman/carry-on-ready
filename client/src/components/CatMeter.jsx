import styled from 'styled-components';

const CatWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  --cat-outline: ${({ theme }) => theme.colors.text};
  --cat-fill: ${({ theme }) => theme.colors.border};
  --cat-eye: #fff;

  @media print {
    display: none;
  }
`;

function LoafCatSvg() {
  const o = 'var(--cat-outline)';
  const f = 'var(--cat-fill)';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shapeRendering="crispEdges" width="100%" height="100%">
      {/* body fill */}
      <rect x="3" y="7" width="10" height="4" fill={f} />
      <rect x="4" y="6" width="8" height="1" fill={f} />
      <rect x="4" y="11" width="8" height="1" fill={f} />
      {/* outline */}
      <rect x="4" y="5" width="8" height="1" fill={o} />
      <rect x="3" y="6" width="1" height="1" fill={o} />
      <rect x="12" y="6" width="1" height="1" fill={o} />
      <rect x="2" y="7" width="1" height="4" fill={o} />
      <rect x="13" y="7" width="1" height="4" fill={o} />
      <rect x="3" y="11" width="10" height="1" fill={o} />
      <rect x="4" y="12" width="8" height="1" fill={o} />
      {/* ears */}
      <rect x="5" y="4" width="1" height="1" fill={o} />
      <rect x="10" y="4" width="1" height="1" fill={o} />
      <rect x="6" y="5" width="1" height="1" fill={f} />
      <rect x="9" y="5" width="1" height="1" fill={f} />
      {/* face */}
      <rect x="6" y="8" width="1" height="1" fill={o} />
      <rect x="9" y="8" width="1" height="1" fill={o} />
      <rect x="7" y="9" width="2" height="1" fill={o} />
    </svg>
  );
}

function SitCatSvg() {
  const o = 'var(--cat-outline)';
  const f = 'var(--cat-fill)';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shapeRendering="crispEdges" width="100%" height="100%">
      {/* fill */}
      <rect x="5" y="5" width="6" height="5" fill={f} />
      <rect x="4" y="9" width="8" height="4" fill={f} />
      <rect x="3" y="10" width="1" height="3" fill={f} />
      {/* outline head */}
      <rect x="5" y="4" width="6" height="1" fill={o} />
      <rect x="4" y="5" width="1" height="4" fill={o} />
      <rect x="11" y="5" width="1" height="4" fill={o} />
      <rect x="5" y="10" width="6" height="1" fill={o} />
      {/* ears */}
      <rect x="5" y="3" width="1" height="1" fill={o} />
      <rect x="10" y="3" width="1" height="1" fill={o} />
      <rect x="6" y="4" width="1" height="1" fill={f} />
      <rect x="9" y="4" width="1" height="1" fill={f} />
      {/* outline body */}
      <rect x="4" y="9" width="8" height="1" fill={o} />
      <rect x="3" y="10" width="1" height="3" fill={o} />
      <rect x="12" y="10" width="1" height="3" fill={o} />
      <rect x="4" y="13" width="8" height="1" fill={o} />
      {/* tail */}
      <rect x="13" y="11" width="1" height="2" fill={o} />
      <rect x="12" y="12" width="1" height="1" fill={o} />
      {/* face */}
      <rect x="6" y="6" width="1" height="1" fill={o} />
      <rect x="9" y="6" width="1" height="1" fill={o} />
      <rect x="7" y="7" width="2" height="1" fill={o} />
    </svg>
  );
}

function WideEyedCatSvg() {
  const o = 'var(--cat-outline)';
  const f = 'var(--cat-fill)';
  const e = 'var(--cat-eye)';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shapeRendering="crispEdges" width="100%" height="100%">
      {/* fill */}
      <rect x="4" y="6" width="8" height="5" fill={f} />
      <rect x="3" y="10" width="10" height="3" fill={f} />
      {/* outline */}
      <rect x="4" y="5" width="8" height="1" fill={o} />
      <rect x="3" y="6" width="1" height="4" fill={o} />
      <rect x="12" y="6" width="1" height="4" fill={o} />
      <rect x="3" y="10" width="10" height="1" fill={o} />
      <rect x="4" y="11" width="8" height="1" fill={o} />
      <rect x="3" y="13" width="10" height="1" fill={o} />
      {/* ears */}
      <rect x="5" y="4" width="1" height="1" fill={o} />
      <rect x="10" y="4" width="1" height="1" fill={o} />
      {/* eyes (wide) */}
      <rect x="6" y="7" width="2" height="2" fill={o} />
      <rect x="8" y="7" width="2" height="2" fill={o} />
      <rect x="6" y="8" width="1" height="1" fill={e} />
      <rect x="9" y="8" width="1" height="1" fill={e} />
      {/* mouth */}
      <rect x="7" y="9" width="2" height="1" fill={o} />
    </svg>
  );
}

function PanicCatSvg() {
  const o = 'var(--cat-outline)';
  const f = 'var(--cat-fill)';
  const e = 'var(--cat-eye)';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shapeRendering="crispEdges" width="100%" height="100%">
      {/* puff fill */}
      <rect x="2" y="6" width="12" height="7" fill={f} />
      <rect x="3" y="5" width="10" height="1" fill={f} />
      <rect x="3" y="13" width="10" height="1" fill={f} />
      {/* outline puff */}
      <rect x="3" y="4" width="10" height="1" fill={o} />
      <rect x="2" y="5" width="1" height="8" fill={o} />
      <rect x="13" y="5" width="1" height="8" fill={o} />
      <rect x="3" y="13" width="10" height="1" fill={o} />
      {/* spiky ears */}
      <rect x="4" y="3" width="1" height="1" fill={o} />
      <rect x="5" y="4" width="1" height="1" fill={o} />
      <rect x="11" y="3" width="1" height="1" fill={o} />
      <rect x="10" y="4" width="1" height="1" fill={o} />
      {/* face */}
      <rect x="5" y="7" width="2" height="2" fill={o} />
      <rect x="9" y="7" width="2" height="2" fill={o} />
      <rect x="5" y="8" width="1" height="1" fill={e} />
      <rect x="10" y="8" width="1" height="1" fill={e} />
      <rect x="7" y="9" width="2" height="1" fill={o} />
      <rect x="6" y="10" width="4" height="1" fill={o} />
      {/* puff tufts */}
      <rect x="1" y="8" width="1" height="1" fill={o} />
      <rect x="14" y="8" width="1" height="1" fill={o} />
      <rect x="1" y="10" width="1" height="1" fill={o} />
      <rect x="14" y="10" width="1" height="1" fill={o} />
    </svg>
  );
}

const VARIANTS = { loaf: LoafCatSvg, sit: SitCatSvg, wide: WideEyedCatSvg, panic: PanicCatSvg };
const LABELS = { loaf: 'sleeping', sit: 'alert', wide: 'wide-eyed', panic: 'panicking' };

function getCatVariant(pct) {
  if (pct > 100) return 'panic';
  if (pct >= 85) return 'wide';
  if (pct >= 70) return 'sit';
  return 'loaf';
}

export default function CatMeter({ percentUsed }) {
  const variant = getCatVariant(percentUsed);
  const CatSvg = VARIANTS[variant];
  const label = `Packing status: ${LABELS[variant]} cat (${Math.round(percentUsed)}%)`;

  return (
    <CatWrap aria-label={label} title={label} data-print-hide>
      <CatSvg />
    </CatWrap>
  );
}
