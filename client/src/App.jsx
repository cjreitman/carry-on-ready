import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => console.error('Health check failed:', err));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>CarryOn Ready</h1>
      <p>Stop overpacking — let's get cracking.</p>
      <p>
        Server status:{' '}
        {health ? <strong>{health.status}</strong> : 'checking...'}
      </p>
    </div>
  );
}

export default App;
