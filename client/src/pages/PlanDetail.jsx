import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function PlanDetail() {
  const { id } = useParams();

  return (
    <div>
      <Title>Plan Detail</Title>
      <p>Plan {id} — detail view coming in CP6.</p>
    </div>
  );
}
