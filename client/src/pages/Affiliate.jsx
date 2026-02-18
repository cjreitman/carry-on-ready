import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Paragraph = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function Affiliate() {
  return (
    <div>
      <Title>Affiliate Disclosure</Title>
      <Paragraph>
        Carry-On Ready may recommend products such as backpacks or travel gear.
      </Paragraph>
      <Paragraph>
        Some links may be affiliate links, which means we may earn a small
        commission if you purchase through those links, at no additional cost to
        you.
      </Paragraph>
      <Paragraph>
        We only recommend products that align with the philosophy of packing
        lighter and smarter.
      </Paragraph>
    </div>
  );
}
