import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Msg = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.9rem;
`;

export default function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = usePro();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const sessionId = params.get('session_id');
    const email = params.get('email');

    if (!sessionId || !email) {
      setStatus('error');
      return;
    }

    api
      .post('/stripe/verify-session', { sessionId, email })
      .then(({ data }) => {
        login(email, data.token);
        setStatus('success');
        setTimeout(() => navigate('/results', { replace: true }), 2000);
      })
      .catch(() => {
        setStatus('error');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'verifying') {
    return (
      <Page>
        <Title>Verifying Payment...</Title>
        <Msg>Please wait while we confirm your purchase.</Msg>
      </Page>
    );
  }

  if (status === 'error') {
    return (
      <Page>
        <Title>Verification Failed</Title>
        <ErrorMsg>
          We couldn't verify your payment. Please contact support if you were
          charged.
        </ErrorMsg>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Pro Unlocked!</Title>
      <Msg>Redirecting you back to your checklist...</Msg>
    </Page>
  );
}
