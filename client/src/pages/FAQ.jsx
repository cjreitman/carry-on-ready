import styled from 'styled-components';

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0;
`;

const Entry = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Question = styled.h3`
  font-size: 1.05rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Answer = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const CatArt = styled.pre`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 8px;
  line-height: 1.15;
  margin: 0;
  margin-left: auto;
  white-space: pre;
  color: ${({ theme }) => theme.colors.textLight};
  user-select: none;
`;

const faqs = [
  {
    q: 'What does Carry-On Ready do?',
    a: 'It generates a packing checklist tailored to your trip length, climate, work setup, and bag size. Optimized for carry-on-only travel.',
  },
  {
    q: 'How does bag size affect my checklist?',
    a: 'Your bag volume (in liters) determines a tier. Each tier caps clothing counts so everything actually fits.',
  },
  {
    q: 'What bag sizes work as carry-on?',
    a: 'Most airlines consider 30–40L bags to be carry-on. Under 25L is ultra-light. 40L is pushing it, and over 45L exceeds limits on some carriers.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. You generate checklists without any account or sign-up.',
  },
  {
    q: 'Can I edit the checklist?',
    a: 'Yes. You can rename items, remove them, or add your own.',
  },
  {
    q: 'Why merino wool?',
    a: 'Merino is naturally odor-resistant, moisture-wicking, and temperature-regulating. It lets you pack fewer items and wear them longer between washes.',
  },
  {
    q: 'What do you think about jeans?',
    a: 'I recommend against jeans. They\'re durable, for sure, but they simply don\'t pack down small enough for an efficient bag. I recommend hiking pants made of nylon/spendex.',
  },
  {
    q: 'What kind of pack should I get?',
    a: 'That I can\'t answer! But Google is your friend, here. Maybe in the future once I get some affiliates I can start recommending specific gear.',
  },
];

export default function FAQ() {
  return (
    <div>
      <TitleRow>
        <Title>Frequently Asked Questions</Title>
        <CatArt title="Kerry says hi">{` ,_     _
 |\\_,-~/
 / _  _ |    ,--.
(  @  @ )   / ,-'
 \\  _T_/-._( (
 /         \`. \\
|         _  \\ |
 \\ \\ ,  /      |
  || |-_\\__   /
 ((_/\`(____,-'`}</CatArt>
      </TitleRow>
      {faqs.map((f, i) => (
        <Entry key={i}>
          <Question>{f.q}</Question>
          <Answer>{f.a}</Answer>
        </Entry>
      ))}
    </div>
  );
}
