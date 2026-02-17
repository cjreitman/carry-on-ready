import styled from 'styled-components';

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  flex-shrink: 0;

  @media print {
    display: none;
  }
`;

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.6rem;
  font-weight: 600;
  line-height: 1;
  cursor: default;
  user-select: none;
`;

const Bubble = styled.span`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  max-width: 240px;
  width: max-content;
  padding: 8px 10px;
  font-size: 0.82rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 140ms ease;

  ${Wrap}:hover & {
    opacity: 1;
  }
`;

export default function InfoTooltip({ text }) {
  return (
    <Wrap>
      <Icon>i</Icon>
      <Bubble>{text}</Bubble>
    </Wrap>
  );
}
