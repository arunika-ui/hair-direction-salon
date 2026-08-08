import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { queryClient } from './lib/queryClient';

import './index.css';

const isStudioRoute = window.location.pathname.startsWith('/studio');

if (isStudioRoute) {
  import('./StudioApp').then(({ default: StudioApp }) => {
    createRoot(document.getElementById('root')!).render(<StudioApp />);
  });
} else {
  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}
