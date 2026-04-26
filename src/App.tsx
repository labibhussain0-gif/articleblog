import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const CreateArticle = lazy(() => import('./pages/CreateArticle'));
const Profile = lazy(() => import('./pages/Profile'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AuthorPage = lazy(() => import('./pages/AuthorPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
import React, { useEffect, lazy, Suspense } from 'react';
import api from './services/api';
import { useAuthStore } from './stores/authStore';

const queryClient = new QueryClient();

function App() {
  const { token, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data, token))
        .catch(() => logout());
    }
  }, [token, setUser, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div></div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="category/:categorySlug" element={<CategoryPage />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="author/:slug" element={<AuthorPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="create" element={<CreateArticle />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="about" element={<StaticPage />} />
            <Route path="contact" element={<StaticPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="cookies" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
