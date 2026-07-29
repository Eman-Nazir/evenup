import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { useCurrentUser } from './features/auth/useCurrentUser';
import { useAuthStore } from './features/auth/useAuthStore';
import AppRoutes from './routes/AppRoutes';

function AuthInitializer({ children }) {
  useCurrentUser(); // fires /auth/me on mount, populates the store
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <AppRoutes />
        </AuthInitializer>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}