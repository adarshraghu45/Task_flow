import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { store } from '@store/index';
import { SocketProvider } from './SocketProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        {children}
        <Toaster richColors position="top-right" closeButton />
        <ReactQueryDevtools initialIsOpen={false} />
      </SocketProvider>
    </QueryClientProvider>
  </Provider>
);
