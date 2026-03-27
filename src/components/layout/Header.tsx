import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { PenSquare, LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          BlogForge
        </Link>
        
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <PenSquare className="w-4 h-4" />
                Write
              </Link>
              <Link to={`/profile/${user.username}`} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
