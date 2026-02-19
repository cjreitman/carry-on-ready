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

const CatArt = styled.pre`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 11px;
  line-height: 1.2;
  margin: 12px 0 0;
  white-space: pre;
  color: ${({ theme }) => theme.colors.textLight};
  user-select: none;
`;

export default function About() {
  return (
    <div>
      <Title>About</Title>
      <Paragraph>
        Hi, my name is Colin. I'm a long-term carry-on digital nomad and software engineer.
      </Paragraph>
      <Paragraph>
        I built Carry-On Ready after spending years refining my own one-bag setup
        for indefinite travel, sometimes by choice, and sometimes because life
        pushed me into it. I wanted something that didn't just spit out a generic
        packing checklist, but heuristically accounted for real-world constraints.
      </Paragraph>
      <Paragraph>
        This app is the result of obsessively testing what fits into a 35L pack
        (and what doesn't) and experimenting until I got a
        system that works. I hope that my app (and my mistakes) can help you as well.
      </Paragraph>
      <Paragraph>
        If Carry-On Ready helped you travel lighter or think more clearly about
        your setup, you can support the project{' '}
        <a href="https://buymeacoffee.com/cjreitman" target="_blank" rel="noopener noreferrer">here</a>.
      </Paragraph>
      <Paragraph />
      <Paragraph>
        <CatArt>{`      |\\      _,,,---,,_
ZZZzz /,\`.-'\`'    -.  ;-;;,_
     |,4-  ) )-,_. ,\\ (  \`'-'
    '---''(_/--'  \`-'\\_)`}</CatArt>
      </Paragraph>
    </div>
  );
}
