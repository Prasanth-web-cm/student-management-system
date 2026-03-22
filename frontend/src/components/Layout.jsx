import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import TopNav from './TopNav';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {isAdmin ? <AdminSidebar /> : <Sidebar />}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <TopNav />
        <main className="flex-1 mt-20 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
