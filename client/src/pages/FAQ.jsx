import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
    q: 'What does Pro unlock?',
    a: 'Pro is a one-time $9 purchase. It lets you save plans, view them later, and export your checklist (copy, print, or PDF), and also as a way to say thanks for building this app :).',
  },
  {
    q: 'Do I need an account?',
    a: 'No. Free users generate checklists without any account. Pro uses your email for payment and plan storage. No password needed!',
  },
  {
    q: 'Can I edit the checklist?',
    a: 'Yes. You can rename items, remove them, or add your own. Edits are saved when you save a plan (Pro).',
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
      <Title>Frequently Asked Questions</Title>
      {faqs.map((f, i) => (
        <Entry key={i}>
          <Question>{f.q}</Question>
          <Answer>{f.a}</Answer>
        </Entry>
      ))}
    </div>
  );
}
