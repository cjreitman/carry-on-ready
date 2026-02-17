import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function Plans() {
  return (
    <div>
      <Title>Saved Plans</Title>
      <p>Plans list coming in CP6.</p>
    </div>
  );
}
