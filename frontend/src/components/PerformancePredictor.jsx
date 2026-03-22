import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { API_BASE } from '../api';

const PerformancePredictor = ({ studentId }) => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/ml/predict/${studentId}`);
        setPredictionData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError('Failed to load performance evaluation');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchPrediction();
  }, [studentId]);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
          <div className="h-6 w-48 bg-slate-100 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
          <div className="h-24 bg-slate-50 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !predictionData) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-red-500">
          <AlertTriangle size={20} />
          <p className="font-semibold">{error || 'No evaluation data available'}</p>
        </div>
      </div>
    );
  }

  const { prediction, factors } = predictionData;
  const gradePercent = (prediction.predictedGrade * 100).toFixed(0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'text-green-600 bg-green-50 border-green-100';
      case 'Average': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'At Risk': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Excellent': return 'from-green-400 to-green-500';
      case 'Average': return 'from-blue-400 to-blue-500';
      case 'At Risk': return 'from-red-400 to-red-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 md:col-span-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-indigo-50 rounded-lg"><Brain className="text-indigo-600 w-6 h-6" /></div>
            AI Performance Evaluation
          </h3>
          <p className="text-slate-500 text-sm mt-1 ml-11">Predictive analysis based on current trends</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-extrabold border shadow-sm ${getStatusColor(prediction.status)}`}>
          {prediction.status} Status
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl"></div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Predicted Final Grade</div>
          <div className={`text-7xl font-black tracking-tighter mb-4 ${prediction.status === 'At Risk' ? 'text-red-600' : 'text-slate-800'}`}>
            {gradePercent}<span className="text-2xl text-slate-400 font-medium tracking-normal">%</span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${getProgressColor(prediction.status)}`}
              style={{ width: `${gradePercent}%` }}
            ></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" />
            Contributing Factors
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Attendance</p>
              <p className="text-xl font-black text-slate-800">{(factors.attendanceRate * 100).toFixed(0)}%</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-400 h-full w-[85%]" style={{ width: `${factors.attendanceRate * 100}%` }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Midterm Rank</p>
              <p className="text-xl font-black text-slate-800">{(factors.midtermScore * 100).toFixed(0)}%</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-400 h-full w-[85%]" style={{ width: `${factors.midtermScore * 100}%` }}></div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Quiz Activity</p>
              <p className="text-xl font-black text-slate-800">{(factors.quizRate * 100).toFixed(0)}%</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-orange-400 h-full w-[85%]" style={{ width: `${factors.quizRate * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-start gap-3">
            <Info className="text-indigo-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-indigo-800 font-medium">
              {prediction.status === 'Excellent' ? 'Keep up the great work! Your consistent attendance and marks are driving your high predicted grade.' :
               prediction.status === 'Average' ? 'You are on track, but there is room for improvement in your quiz participation and midterms.' :
               'Attention required. Your attendance or midterm marks are below the optimal threshold for passing.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePredictor;
