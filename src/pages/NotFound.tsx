import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4">
      <Helmet>
        <title>404 Not Found | The Daily Pulse</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
