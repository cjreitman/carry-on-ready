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
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const CTA = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 14px 32px;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.1rem;
  font-weight: 600;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: none;
  }
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
        CarryOn Ready generates a capacity-aware packing checklist based on your
        trip length, climate, and work setup.
      </Subhead>
      <CTA to="/build">Generate My Carry-On Plan</CTA>
      <Tagline>Stop overpacking and get cracking.</Tagline>
    </Hero>
  );
}
