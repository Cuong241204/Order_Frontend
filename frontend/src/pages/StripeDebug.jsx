import React, { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

const StripeDebug = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    setDebugInfo({
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements,
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...',
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      hasEnv: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    });
  }, [stripe, elements]);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Stripe Debug Page</h1>
      
      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
        <h3>Environment Variables:</h3>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '2rem', background: stripe ? '#e6ffe6' : '#ffe6e6', padding: '1rem', borderRadius: '8px' }}>
        <h3>Stripe Status:</h3>
        <p>✅ Stripe Loaded: {stripe ? 'YES' : 'NO'}</p>
        <p>✅ Elements Loaded: {elements ? 'YES' : 'NO'}</p>
        <p>✅ Publishable Key: {debugInfo.hasEnv ? 'CONFIGURED' : 'MISSING'}</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Next Steps:</h3>
        {stripe && elements ? (
          <p style={{ color: 'green' }}>✅ Stripe hoạt động! Bạn có thể test payment.</p>
        ) : (
          <div>
            <p style={{ color: 'red' }}>❌ Stripe chưa hoạt động. Hãy:</p>
            <ol>
              <li>Check file <code>frontend/.env</code> có <code>VITE_STRIPE_PUBLISHABLE_KEY</code></li>
              <li>Restart frontend: <code>npm run dev</code></li>
              <li>Hard refresh: Cmd+Shift+R</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeDebug;
