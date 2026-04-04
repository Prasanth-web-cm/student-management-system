import React from 'react';
import { Download, CheckCircle, FileText, AlertCircle, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PerformancePredictor from '../components/PerformancePredictor';
import { API_BASE } from '../api';
import axios from 'axios';

export default function StudentDashboard() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [student, setStudent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Use a valid MongoDB ObjectId as a fallback
  const studentId = id || (currentUser && currentUser._id);

  React.useEffect(() => {
    if (id) {
      // If we have an ID in URL, fetch that specific student
      fetchStudentDetails(id);
    } else if (currentUser && currentUser.role === 'student') {
      // If no ID in URL but we are a student, use current user
      setStudent(currentUser);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, currentUser]);

  const fetchStudentDetails = async (sid) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/students/${sid}`);
      setStudent(res.data);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadMarks = () => {
    if (!studentId) return;
    window.location.href = `${API_BASE}/api/export/marks/${studentId}`;
  };

  const downloadAttendance = () => {
    if (!studentId) return;
    window.location.href = `${API_BASE}/api/export/attendance/${studentId}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-slate-400 font-bold animate-pulse">Syncing profile data...</div>;
  if (!student) return <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">Student records not located</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-100/50 border border-slate-50 relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <img 
                src={student?.photoUrl ? `${API_BASE}${student.photoUrl}` : `https://ui-avatars.com/api/?name=${student?.name || 'User'}&background=random`} 
                alt={student?.name || 'Student'} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
              <User size={20} />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
              <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-widest">{student?.dept || 'N/A'} Dept</span>
              <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest">Section {student?.sec || 'N/A'}</span>
            </div>
            <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">{student?.name || 'Unknown Student'}</h1>
            <p className="text-slate-400 font-mono font-bold tracking-widest uppercase">{student?.studentId || 'ID PENDING'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="text-green-500 w-6 h-6" /></div>
              Attendance
            </h3>
            <button onClick={downloadAttendance} className="text-slate-600 hover:text-primary-700 bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
              <Download size={16} /> Export CSV
            </button>
          </div>
          <div className="flex items-end gap-3 px-2">
            <div className="text-6xl font-black text-slate-800 tracking-tighter">85<span className="text-3xl text-slate-400 font-medium tracking-normal">%</span></div>
            <p className="text-slate-500 pb-2 font-medium">Overall present</p>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full mt-8 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full w-[85%] shadow-sm"></div>
          </div>
        </div>

        {/* Marks Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-blue-50 rounded-lg"><FileText className="text-blue-500 w-6 h-6" /></div>
              Recent Marks
            </h3>
            <button onClick={downloadMarks} className="text-slate-600 hover:text-primary-700 bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm">
              <Download size={16} /> Export CSV
            </button>
          </div>
          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Data Structures</p>
                <p className="text-sm text-slate-500 mt-0.5">Midterm Exam</p>
              </div>
              <div className="text-xl font-black text-primary-600 bg-primary-50 px-4 py-1.5 rounded-xl">88/100</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Database Systems</p>
                <p className="text-sm text-slate-500 mt-0.5">Midterm Exam</p>
              </div>
              <div className="text-xl font-black text-primary-600 bg-primary-50 px-4 py-1.5 rounded-xl">92/100</div>
            </div>
          </div>
        </div>
        
        {/* AI Performance Predictor */}
        <PerformancePredictor studentId={studentId} />

        {/* Pending Quizzes/Forms */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 md:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-orange-50 rounded-lg"><AlertCircle className="text-orange-500 w-6 h-6" /></div>
            Pending Action
          </h3>
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center border border-orange-100/80 shadow-inner">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-lg font-bold text-orange-900">Mid-Semester Feedback Form</p>
              <p className="text-sm font-medium text-orange-700 mt-1">Closes in 2 days</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5">
              Fill Form Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
