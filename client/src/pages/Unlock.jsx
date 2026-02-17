import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function Unlock() {
  return (
    <div>
      <Title>Unlock Pro</Title>
      <p>Stripe checkout coming in CP7.</p>
    </div>
  );
}
