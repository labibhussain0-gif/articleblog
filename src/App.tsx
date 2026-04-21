import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticlePage from './pages/ArticlePage';
import CreateArticle from './pages/CreateArticle';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';
import AuthorPage from './pages/AuthorPage';
import SearchPage from './pages/SearchPage';
import StaticPage from './pages/StaticPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import { useEffect } from 'react';
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
            <Route path="about" element={<StaticPage slug="about" />} />
            <Route path="contact" element={<StaticPage slug="contact" />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="cookies" element={<CookiePolicyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
