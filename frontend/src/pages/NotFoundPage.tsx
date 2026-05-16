import { Link } from 'react-router-dom';
import { Button } from '@components/ui';

export const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-bold text-brand-600">404</h1>
    <p className="mt-4 text-xl text-content">Page not found</p>
    <p className="mt-2 text-content-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link to="/" className="mt-8">
      <Button>Go home</Button>
    </Link>
  </div>
);
