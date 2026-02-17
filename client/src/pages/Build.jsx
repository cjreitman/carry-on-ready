import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function Build() {
  return (
    <div>
      <Title>Build Your Packing Plan</Title>
      <p>Itinerary builder coming in CP4.</p>
    </div>
  );
}
