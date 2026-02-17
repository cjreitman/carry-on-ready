import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const NavInner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  &:hover { text-decoration: none; }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  font-size: 0.95rem;
`;

const Main = styled.main`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  min-height: calc(100vh - 130px);
`;

const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default function Layout() {
  return (
    <>
      <Nav>
        <NavInner>
          <Logo to="/">CarryOn Ready</Logo>
          <NavLinks>
            <Link to="/build">Build</Link>
            <Link to="/faq">FAQ</Link>
          </NavLinks>
        </NavInner>
      </Nav>
      <Main>
        <Outlet />
      </Main>
      <Footer>CarryOn Ready</Footer>
    </>
  );
}
