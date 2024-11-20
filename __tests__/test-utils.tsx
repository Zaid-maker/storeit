import React from 'react';
import { render as rtlRender } from '@testing-library/react';

// Add any providers that your app needs here
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
