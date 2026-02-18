import { useState } from 'react';
import styled from 'styled-components';
import usePro from '../context/ProContext';
import api from '../utils/api';

const Page = styled.div`
  max-width: 440px;
  margin: 0 auto;
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.95rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 0.95rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Btn = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.9rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProBadge = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.95rem;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Features = styled.ul`
  text-align: left;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  padding-left: 20px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  list-style: disc;
  max-width: 280px;

  li {
    margin-bottom: 4px;
  }
`;

export default function Unlock() {
  const { isPro } = usePro();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/stripe/create-checkout-session', {
        email: trimmed,
      });
      window.location.href = data.url;
    } catch (err) {
      setError(
        err.response?.data?.error || 'Something went wrong. Please try again.'
      );
      setLoading(false);
    }
  }

  if (isPro) {
    return (
      <Page>
        <Title>You're Already Pro</Title>
        <ProBadge>Export and save features are unlocked.</ProBadge>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Unlock Pro</Title>
      <Subtitle>One-time payment. No subscription. No account required.</Subtitle>
      <Features>
        <li>Copy checklist to clipboard</li>
        <li>Print-optimized export</li>
        <li>Save plans (coming soon)</li>
        <li>Buy me a couple beers</li>
      </Features>
      <Card>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheckout()}
        />
        <Btn onClick={handleCheckout} disabled={loading}>
          {loading ? 'Redirecting...' : 'Unlock Pro — $9'}
        </Btn>
      </Card>
    </Page>
  );
}
