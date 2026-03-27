import { Outlet } from 'react-router-dom';
import StickyHeader from './StickyHeader';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <StickyHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
