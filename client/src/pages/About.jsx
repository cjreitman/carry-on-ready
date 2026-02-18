import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Paragraph = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Signature = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

export default function About() {
  return (
    <div>
      <Title>About</Title>
      <Paragraph>
        Hi, I'm a long-term carry-on traveler and software engineer.
      </Paragraph>
      <Paragraph>
        I built Carry-On Ready after spending years refining my own one-bag setup
        for indefinite travel, sometimes by choice, and sometimes because life
        pushed me into it. I wanted something that didn't just spit out a generic
        packing checklist, but actually accounted for real-world constraints.
      </Paragraph>
      <Paragraph>
        This app is the result of obsessively testing what fits into a 35L pack
        (and what doesn't), learning the hard way, and iterating until I got a
        system that works. My goal is simple: help you pack lighter, smarter,
        with more confidence, and without overthinking every decision.
      </Paragraph>
      <Paragraph>
        If Carry-On Ready has helped you travel lighter or think more clearly about
        your setup, you can support the project{' '}
        <a href="https://buymeacoffee.com/cjreitman" target="_blank" rel="noopener noreferrer">here</a>.
      </Paragraph>
      <Signature>
        <div>Colin</div>
      </Signature>
    </div>
  );
}
