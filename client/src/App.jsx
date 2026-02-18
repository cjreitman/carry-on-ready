import { useState, useCallback, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import { ProProvider } from './context/ProContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Build from './pages/Build';
import Results from './pages/Results';
import Unlock from './pages/Unlock';
import Success from './pages/Success';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Legal from './pages/Legal';

const STORAGE_KEY = 'carryonready-theme';

function getInitialMode() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

const ThemeModeContext = createContext({ mode: 'light', toggle: () => {} });

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function App() {
  const [mode, setMode] = useState(getInitialMode);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ProProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/build" element={<Build />} />
                <Route path="/results" element={<Results />} />
                <Route path="/unlock" element={<Unlock />} />
                <Route path="/success" element={<Success />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/plans/:id" element={<PlanDetail />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/legal" element={<Legal />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
