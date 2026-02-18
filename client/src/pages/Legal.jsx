import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmailLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
`;

export default function Legal() {
  return (
    <div>
      <Title>Legal &amp; Policies</Title>

      <Section>
        <SectionTitle>About</SectionTitle>
        <Text>
          Carry-On Ready is a lightweight planning tool that generates optimized
          carry-on packing checklists based on your itinerary, bag size, and
          travel constraints.
        </Text>
      </Section>

      <Section id="contact">
        <SectionTitle>Contact</SectionTitle>
        <Text>
          Questions or comments? Reach me at{' '}
          <EmailLink href="mailto:colin.carryonready.app@proton.me">
            colin.carryonready.app@proton.me
          </EmailLink>
          .
        </Text>
      </Section>
    </div>
  );
}
