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

export default function Privacy() {
  return (
    <div>
      <Title>Privacy Policy</Title>
      <Paragraph>Effective Date: February 17, 2026</Paragraph>
      <Paragraph>
        Carry-On Ready is designed to collect as little personal information as
        possible.
      </Paragraph>

      <SubHeading>Information We Collect</SubHeading>
      <Paragraph>We may collect:</Paragraph>
      <BulletList>
        <li>Information you input into the app (trip details, preferences)</li>
        <li>Anonymous usage data (if analytics are enabled)</li>
      </BulletList>
      <Paragraph>We do not sell personal data.</Paragraph>

      <SubHeading>How Information Is Used</SubHeading>
      <Paragraph>Information is used to:</Paragraph>
      <BulletList>
        <li>Generate packing recommendations</li>
        <li>Improve the app</li>
      </BulletList>
      <Paragraph>
        If analytics tools are used, they may collect anonymous traffic data
        (such as device type or general location).
      </Paragraph>

      <SubHeading>Third Parties</SubHeading>
      <Paragraph>We may use:</Paragraph>
      <BulletList>
        <li>Hosting providers (e.g., Vercel, Render)</li>
        <li>Analytics providers (if enabled)</li>
      </BulletList>
      <Paragraph>
        These services may process limited data as part of their infrastructure.
      </Paragraph>

      <SubHeading>Data Retention</SubHeading>
      <Paragraph>
        If you do not create an account, your data is not stored long-term unless
        necessary for technical performance or logging.
      </Paragraph>
      <Paragraph>
        If plan-saving is introduced in the future, this policy will be updated
        accordingly.
      </Paragraph>

      <SubHeading>Security</SubHeading>
      <Paragraph>
        Reasonable technical measures are used to protect the application, but no
        online service can guarantee absolute security.
      </Paragraph>

      <SubHeading>Your Rights</SubHeading>
      <Paragraph>
        Depending on your jurisdiction, you may have rights regarding access or
        deletion of your data. Contact us for requests.
      </Paragraph>

      <SubHeading>Contact</SubHeading>
      <Paragraph>
        For privacy questions, contact:{' '}
        <a href="mailto:colin.carryonready.app@proton.me">colin.carryonready.app@proton.me</a>
      </Paragraph>
    </div>
  );
}
