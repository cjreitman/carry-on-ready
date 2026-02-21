import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Hero = styled.section`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const Headline = styled.h1`
  font-size: 2.2rem;
  line-height: 1.25;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
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
  padding: 16px 40px;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.2rem;
  font-weight: 600;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: none;
  }
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HelperText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Tagline = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
`;

const HowSection = styled.section`
  max-width: 440px;
  margin: ${({ theme }) => theme.spacing.xxl} auto 0;
`;

const HowHeading = styled.h2`
  font-size: 1.1rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const HowList = styled.ol`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const HowInsight = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
`;

const CatArt = styled.pre`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 11px;
  line-height: 1.2;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  white-space: pre;
  color: ${({ theme }) => theme.colors.textLight};
  user-select: none;
  display: inline-block;
  text-align: left;
`;

export default function Landing() {
  return (
    <Hero>
      <CatArt title="Kerry says hi">{`    /\\_/\\           ___
   = o_o =_______    \\ \\
    __^      __(  \\.__) )
(@)<_____>__(_____)____/`}</CatArt>
      <Headline>Pack 30 Days Into a 35L Carry-On.</Headline>
      <Subhead>
        Know what fits before you pack.
      </Subhead>
      <CTA to="/build">Generate My Carry-On Plan</CTA>
      <Subhead>No account required. Takes 60 seconds.</Subhead>
      <HowSection>
        <HowHeading>How It Works</HowHeading>
        <HowList>
          <div>Enter your trip details and bag size.</div>
          <div>We model realistic item volumes in liters.</div>
          <div>See what actually fits before you pack.</div>
        </HowList>
      </HowSection>
    </Hero>
  );
}
