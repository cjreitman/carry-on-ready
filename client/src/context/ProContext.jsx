import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ProContext = createContext({
  email: null,
  token: null,
  isPro: false,
  login: () => {},
  logout: () => {},
});

export function ProProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem('pro_email'));
  const [token, setToken] = useState(() => localStorage.getItem('pro_token'));
  const [isPro, setIsPro] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsPro(false);
      return;
    }

    api
      .get('/pro/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setIsPro(data.isPro);
        if (!data.isPro) {
          localStorage.removeItem('pro_token');
          localStorage.removeItem('pro_email');
          setToken(null);
          setEmail(null);
        }
      })
      .catch(() => {
        setIsPro(false);
      });
  }, [token]);

  function login(newEmail, newToken) {
    localStorage.setItem('pro_email', newEmail);
    localStorage.setItem('pro_token', newToken);
    setEmail(newEmail);
    setToken(newToken);
    setIsPro(true);
  }

  function logout() {
    localStorage.removeItem('pro_email');
    localStorage.removeItem('pro_token');
    setEmail(null);
    setToken(null);
    setIsPro(false);
  }

  return (
    <ProContext.Provider value={{ email, token, isPro, login, logout }}>
      {children}
    </ProContext.Provider>
  );
}

export default function usePro() {
  return useContext(ProContext);
}
