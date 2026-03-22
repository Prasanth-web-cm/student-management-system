import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileEdit, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path) => location.pathname === path
    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
    : 'text-slate-400 hover:bg-slate-800 hover:text-white';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Manage Students', path: '/admin/students' },
    { icon: ClipboardList, label: 'Academic Records', path: '/attendance' },
    { icon: FileEdit, label: 'Forms & Quizzes', path: '/marks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20">
      {/* Admin Branding */}
      <div className="p-8 border-b border-slate-800/50 bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl tracking-tight leading-tight">Admin<span className="text-primary-500 text-2xl">.</span></h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Portal Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-1.5">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</p>
        
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive(item.path)}`}
          >
            <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-sm">{item.label}</span>
            {isActive(item.path).includes('bg-primary-600') && (
              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-slate-800/50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group border border-red-500/10 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
