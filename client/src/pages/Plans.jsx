import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import usePro from '../context/ProContext';
import api from '../utils/api';

const Page = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: inherit;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 4px;
`;

const CardMeta = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  text-align: center;
`;

const Loading = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export default function Plans() {
  const { isPro } = usePro();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPro) {
      navigate('/unlock', { replace: true });
      return;
    }

    api
      .get('/plans')
      .then(({ data }) => setPlans(data.plans))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isPro, navigate]);

  if (!isPro) return null;

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function summarize(plan) {
    const stops = plan.inputs?.stops;
    if (!stops || stops.length === 0) return '';
    const destinations = stops.map((s) => s.countryOrRegion).join(', ');
    const bag = plan.inputs?.bagLiters ? `${plan.inputs.bagLiters}L` : '';
    return [destinations, bag].filter(Boolean).join(' · ');
  }

  return (
    <Page>
      <Title>Saved Plans</Title>

      {loading && <Loading>Loading...</Loading>}

      {!loading && plans.length === 0 && (
        <Empty>No saved plans yet. Generate a checklist and save it.</Empty>
      )}

      {plans.map((plan) => (
        <Card key={plan._id} to={`/plans/${plan._id}`}>
          <CardTitle>{plan.title}</CardTitle>
          <CardMeta>
            {formatDate(plan.createdAt)}
            {summarize(plan) && ` · ${summarize(plan)}`}
          </CardMeta>
        </Card>
      ))}
    </Page>
  );
}
