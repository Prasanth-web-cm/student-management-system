import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Trash2, 
  ExternalLink,
  PlusCircle,
  Filter,
  ArrowLeft,
  Edit,
  MoreVertical
} from 'lucide-react';
import { API_BASE } from '../api';
import axios from 'axios';

export default function ManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/students`);
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this student record?')) {
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
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || student.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <button 
             onClick={() => navigate('/admin/dashboard')}
             className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-4 transition-colors group">
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             Back to Dashboard
           </button>
           <h1 className="text-4xl font-[900] text-slate-900 tracking-tight flex items-center gap-4">
             Student <span className="text-primary-600">Management</span>
             <span className="text-sm font-bold bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full uppercase tracking-widest">{students.length} Total</span>
           </h1>
        </div>
        <button 
          onClick={() => navigate('/register')}
          className="flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1 active:scale-95">
          <PlusCircle size={20} />
          Register New Student
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by name or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-4 rounded-2xl border-none">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-600 min-w-[120px]">
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept} Department</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-100/50 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-6">Student Information</th>
                <th className="px-6 py-6">Identity</th>
                <th className="px-6 py-6">Department & Section</th>
                <th className="px-6 py-6">Contact</th>
                <th className="px-8 py-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="py-24 text-center text-slate-300 font-bold italic tracking-widest uppercase text-sm">Querying Central Registry...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="5" className="py-24 text-center text-slate-300 font-bold italic tracking-widest uppercase text-sm">No matching records found</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
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
                          <p className="font-[800] text-slate-900 text-lg leading-tight group-hover:text-primary-600 transition-colors uppercase tracking-tight">{student.name}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Enrollment Active</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-mono text-sm font-bold text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg inline-block uppercase tracking-tighter">
                        {student.studentId}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-extrabold text-slate-700 uppercase tracking-wide">{student.dept} Dept</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section {student.sec}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-600">
                      {student.phone}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => navigate(`/students/${student._id}`)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-white hover:text-primary-600 transition-all shadow-sm border border-transparent hover:border-slate-200 font-bold text-xs uppercase tracking-wider">
                          <ExternalLink size={14} /> Profile
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 hover:border-red-500 flex items-center justify-center">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
                           <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
