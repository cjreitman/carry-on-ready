import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Build from './pages/Build';
import Results from './pages/Results';
import Unlock from './pages/Unlock';
import Success from './pages/Success';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import FAQ from './pages/FAQ';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
