import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FilePlus, 
  Database, 
  Search, 
  TrendingUp, 
  BookOpen, 
  Trash2, 
  ExternalLink,
  PlusCircle,
  Download
} from 'lucide-react';
import { API_BASE } from '../api';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    newRegistrations: 0,
    quizzesCreated: 0,
    averageAttendance: '94%'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/students`);
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);
      setStats(prev => ({
        ...prev,
        totalStudents: data.length,
        newRegistrations: data.filter(s => {
          if (!s.createdAt) return false;
          const regDate = new Date(s.createdAt);
          const now = new Date();
          return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
        }).length
      }));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setStudents([]); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student record?')) {
      try {
        await axios.delete(`${API_BASE}/api/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    if (!student || !student.name || !student.studentId) return false;
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.dept && student.dept.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-white/60">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Database size={120} className="text-primary-600 rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-[900] text-slate-900 mb-3 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Administrator</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">
            Monitor institutional growth, manage academic excellence, and oversee student records from your unified command center.
          </p>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'from-blue-500 to-indigo-600', trend: '+12%' },
          { label: 'New This Month', value: stats.newRegistrations, icon: TrendingUp, color: 'from-emerald-500 to-teal-600', trend: '+5%' },
          { label: 'Active Quizzes', value: '24', icon: BookOpen, color: 'from-amber-500 to-orange-600', trend: 'Stable' },
          { label: 'Attendance Rate', value: stats.averageAttendance, icon: Database, color: 'from-purple-500 to-pink-600', trend: '+2.4%' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-100/50 border border-slate-50 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-[800] text-slate-900 tracking-tighter">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Management Table (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-100/50 border border-slate-50 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-[800] text-slate-800 tracking-tight">Recent Registrations</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Review and manage newly registered students</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-8 py-4">Student Identity</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="4" className="py-20 text-center text-slate-300 font-bold italic tracking-widest uppercase text-xs">Accessing Database...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan="4" className="py-20 text-center text-slate-300 font-bold italic tracking-widest uppercase text-xs">No records found matching your query</td></tr>
                ) : (
                  filteredStudents.slice(0, 8).map(student => (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white bg-slate-100 shadow-md group-hover:scale-105 transition-transform duration-300">
                              <img 
                                src={student.photoUrl ? `${API_BASE}${student.photoUrl}` : `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                                alt={student.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                          </div>
                          <div>
                            <p className="font-[800] text-slate-900 group-hover:text-primary-600 transition-colors">{student.name}</p>
                            <p className="text-xs font-bold text-slate-400 font-mono tracking-tighter uppercase">{student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-600 text-xs font-extrabold uppercase tracking-wider">
                          {student.dept}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-xs font-bold text-slate-600">Active</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => navigate(`/students/${student._id}`)}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                            <ExternalLink size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student._id)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 hover:border-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
             <p className="text-sm font-bold text-slate-400">Showing {Math.min(filteredStudents.length, 8)} of {filteredStudents.length} entries</p>
             <button 
                onClick={() => navigate('/admin/students')}
                className="text-sm font-extrabold text-primary-600 hover:text-primary-700 underline underline-offset-8">
                View Comprehensive Database
             </button>
          </div>
        </div>

        {/* Quick Actions & Insights (1/3) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <PlusCircle size={80} />
            </div>
            <h4 className="text-xl font-[800] mb-2">Quick Actions</h4>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed italic">Streamline institutional management with one-click operations.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white/10 hover:bg-white text-white hover:text-slate-900 transition-all duration-500 border border-white/10 hover:border-white shadow-xl group/btn">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-primary-500/20 group-hover/btn:bg-primary-500 flex items-center justify-center transition-colors">
                     <FilePlus size={20} className="group-hover/btn:text-white" />
                   </div>
                   <span className="font-bold text-sm tracking-tight">Onboard Student</span>
                </div>
                <PlusCircle size={18} className="opacity-40 group-hover/btn:opacity-100" />
              </button>

              <button 
                onClick={() => navigate('/attendance')}
                className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white/10 hover:bg-white text-white hover:text-slate-900 transition-all duration-500 border border-white/10 hover:border-white shadow-xl group/btn">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-teal-500/20 group-hover/btn:bg-teal-500 flex items-center justify-center transition-colors">
                     <TrendingUp size={20} className="group-hover/btn:text-white" />
                   </div>
                   <span className="font-bold text-sm tracking-tight">Post Attendance</span>
                </div>
                <ExternalLink size={18} className="opacity-40 group-hover/btn:opacity-100" />
              </button>

              <button 
                className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white/10 hover:bg-white text-white hover:text-slate-900 transition-all duration-500 border border-white/10 hover:border-white shadow-xl group/btn">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/20 group-hover/btn:bg-purple-500 flex items-center justify-center transition-colors">
                     <PlusCircle size={20} className="group-hover/btn:text-white" />
                   </div>
                   <span className="font-bold text-sm tracking-tight">Design Quiz</span>
                </div>
                <PlusCircle size={18} className="opacity-40 group-hover/btn:opacity-100" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-100/50 border border-slate-50">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Download size={20} />
                </div>
                <h4 className="text-lg font-[800] text-slate-800 tracking-tight">Registry Export</h4>
             </div>
             <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">Export the entire student registry for offline archiving or reporting purposes.</p>
             <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  Export CSV
                </button>
                <button className="py-3 px-4 rounded-xl bg-pink-50 text-pink-700 text-xs font-extrabold uppercase tracking-wider hover:bg-pink-600 hover:text-white transition-all shadow-sm">
                  Export PDF
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
