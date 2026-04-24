import { useState } from 'react';
import { subscribeEmail } from '../lib/firebase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setError('');
      try {
        await subscribeEmail(email, 'newsletter');
        setSubscribed(true);
        setEmail('');
      } catch (err) {
        console.error('Failed to subscribe:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm font-medium text-center">
        ✓ Thank you for subscribing!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm font-medium text-center">
          {error}
        </div>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(''); }}
        placeholder="Enter your email"
        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
        required
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Subscribing...' : 'Subscribe Now'}
      </button>
    </form>
  );
}
