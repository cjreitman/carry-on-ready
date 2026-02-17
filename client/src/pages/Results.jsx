import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function Results() {
  return (
    <div>
      <Title>Your Packing Checklist</Title>
      <p>Checklist results coming in CP4.</p>
    </div>
  );
}
