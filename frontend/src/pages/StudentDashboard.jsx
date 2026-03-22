import React from 'react';
import { Download, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PerformancePredictor from '../components/PerformancePredictor';

export default function StudentDashboard() {
  const { id } = useParams();
  const { user } = useAuth();
  const studentId = id || (user && user._id) || '123'; // Fallback for demo if no ID

  const downloadMarks = () => {
    // In real app, call /api/export/marks/:id
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/export/marks/123`;
  };

  const downloadAttendance = () => {
    // In real app, call /api/export/attendance/:id
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/export/attendance/123`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0 z-10 bg-slate-100">
          <img src="img.jpg" alt="Student" className="w-full h-full object-cover" />
        </div>
        <div className="z-10 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">prasanth</h2>
          <p className="text-slate-500 font-medium mt-1">B.Tech Computer Science - Section A</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <span className="bg-green-100/80 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">Status: Active</span>
            <span className="bg-primary-100/80 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">ID: 234E1A3382</span>
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
