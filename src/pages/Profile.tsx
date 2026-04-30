import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';

export default function Profile() {
  const { username } = useParams<{ username: string }>();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      // We don't have a dedicated user profile endpoint yet, so we'll just show a placeholder
      // In a real app, we'd fetch the user profile and their articles
      return { username, name: username, bio: 'A passionate writer.', avatarUrl: null };
    }
  });

  if (isLoading) return <div className="text-center py-12">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Helmet>
        <title>{user?.name || 'Profile'} | The Daily Pulse</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex items-center gap-8 mb-12">
        <img 
          src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&size=128`} 
          alt={user?.name} 
          className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">@{user?.username}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">{user?.bio}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Articles</h2>
        <p className="text-gray-500 dark:text-gray-400">No articles published yet.</p>
      </div>
    </div>
  );
}
