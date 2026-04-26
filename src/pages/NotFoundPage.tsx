import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        noindex={true}
      />
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-red-600 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>404</h1>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Page not found
          </h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
