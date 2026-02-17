import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function Success() {
  return (
    <div>
      <Title>Payment Successful</Title>
      <p>Verification flow coming in CP7.</p>
    </div>
  );
}
