import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';
import usePro from '../context/ProContext';
import { useThemeMode } from '../App';

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
  align-items: center;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  padding: 2px 4px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textLight};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default function Layout() {
  const { isPro } = usePro();
  const { mode, toggle } = useThemeMode();

  return (
    <>
      <Nav>
        <NavInner>
          <Logo to="/">Carry-On Ready</Logo>
          <NavLinks>
            <Link to="/build">Build</Link>
            {isPro && <Link to="/plans">Plans</Link>}
            <Link to="/faq">FAQ</Link>
            <ThemeToggle onClick={toggle} title="Toggle theme">
              {mode === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
            </ThemeToggle>
          </NavLinks>
        </NavInner>
      </Nav>
      <Main>
        <Outlet />
      </Main>
      <Footer>
          <span>Carry-On Ready</span>
          <Link to="/legal">Legal</Link>
          <Link to="/legal#contact">Contact</Link>
        </Footer>
    </>
  );
}
