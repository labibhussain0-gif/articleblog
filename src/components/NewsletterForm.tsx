import { useState } from 'react';
import { subscribeEmail } from '../lib/firebase';

interface NewsletterFormProps {
  source?: string;
}

export default function NewsletterForm({ source = 'newsletter' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await subscribeEmail(email, source);
        setSubscribed(true);
        setEmail('');
      } catch (error) {
        console.error('Failed to subscribe:', error);
      } finally {
        setIsSubmitting(false);
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
      <input
        type="email"
        aria-label="Email address for newsletter"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50 disabled:opacity-50"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
      </button>
    </form>
  );
}
