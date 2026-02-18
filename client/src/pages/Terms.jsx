import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SubHeading = styled.h2`
  font-size: 1.15rem;
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Paragraph = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BulletList = styled.ul`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-left: 20px;
`;

export default function Terms() {
  return (
    <div>
      <Title>Terms of Service</Title>
      <Paragraph>Effective Date: February 17, 2026</Paragraph>
      <Paragraph>Welcome to Carry-On Ready.</Paragraph>
      <Paragraph>
        Carry-On Ready is a planning tool that generates packing recommendations
        based on the information you provide. By using this site, you agree to
        the following terms.
      </Paragraph>

      <SubHeading>Informational Use Only</SubHeading>
      <Paragraph>
        Carry-On Ready provides estimates and recommendations for packing and
        travel planning. These recommendations are based on heuristics and best
        guesses.
      </Paragraph>
      <Paragraph>We do not guarantee:</Paragraph>
      <BulletList>
        <li>Accuracy of climate predictions</li>
        <li>Accuracy of document recommendations</li>
        <li>That items will fit in your specific bag</li>
        <li>That recommendations will meet airline, border, or legal requirements</li>
      </BulletList>
      <Paragraph>You are responsible for verifying:</Paragraph>
      <BulletList>
        <li>Travel documents</li>
        <li>Visa requirements</li>
        <li>Airline baggage rules</li>
        <li>Weather forecasts</li>
      </BulletList>
      <Paragraph>
        Carry-On Ready is not a travel authority, legal advisor, or government
        source.
      </Paragraph>

      <SubHeading>No Liability</SubHeading>
      <Paragraph>
        To the fullest extent permitted by law, Carry-On Ready and its creator
        are not liable for:
      </Paragraph>
      <BulletList>
        <li>Missed flights</li>
        <li>Denied boarding</li>
        <li>Entry refusal</li>
        <li>Damaged or lost property</li>
        <li>Trip interruptions</li>
        <li>Financial losses</li>
        <li>Any indirect or consequential damages</li>
      </BulletList>
      <Paragraph>Use the tool at your own discretion.</Paragraph>

      <SubHeading>Payments</SubHeading>
      <Paragraph>
        If you purchase access to premium features or make voluntary payments:
      </Paragraph>
      <BulletList>
        <li>All payments are processed through Stripe</li>
        <li>We do not store your payment information</li>
        <li>Refunds are discretionary unless otherwise stated</li>
      </BulletList>

      <SubHeading>Intellectual Property</SubHeading>
      <Paragraph>
        All content, branding, and software within Carry-On Ready are the
        property of the creator unless otherwise noted.
      </Paragraph>
      <Paragraph>You may not:</Paragraph>
      <BulletList>
        <li>Reproduce</li>
        <li>Redistribute</li>
        <li>Reverse engineer</li>
        <li>Copy substantial portions of the app</li>
      </BulletList>
      <Paragraph>Without permission.</Paragraph>

      <SubHeading>Changes to These Terms</SubHeading>
      <Paragraph>
        We may update these terms at any time. Continued use of the app
        constitutes acceptance of updated terms.
      </Paragraph>

      <SubHeading>Contact</SubHeading>
      <Paragraph>
        For questions about these terms, contact:{' '}
        <a href="mailto:colin.carryonready.app@proton.me">colin.carryonready.app@proton.me</a>
      </Paragraph>
    </div>
  );
}
