import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Hero = styled.section`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const Headline = styled.h1`
  font-size: 2.2rem;
  line-height: 1.25;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const Subhead = styled.p`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
  line-height: 1.6;
`;

const Supporting = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const CTA = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 16px 40px;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.2rem;
  font-weight: 600;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: none;
  }
`;

const HelperText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Tagline = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
`;

export default function Landing() {
  return (
    <Hero>
      <Headline>Pack 30 Days Into a 35L Carry-On — Without Guessing.</Headline>
      <Subhead>
        Carry-On Ready generates a capacity-aware packing checklist based on your
        trip length, climate, and work setup.
      </Subhead>
      <Supporting>
        Optimized for 25–40L backpacks and long stays.
      </Supporting>
      <CTA to="/build">Generate My Carry-On Plan</CTA>
      <HelperText>No account required. Takes 60 seconds.</HelperText>
      <Tagline>Keep calm and Carry-On.</Tagline>
    </Hero>
  );
}
