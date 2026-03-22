const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');
const Attendance = require('../models/Attendance');
const { predictPerformance } = require('../services/mlService');

// Get performance prediction for a student
router.get('/predict/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1. Fetch Attendance Data
    const attendanceRecords = await Attendance.find({ studentId });
    let attendanceRate = 0.5; // Default if no data
    if (attendanceRecords.length > 0) {
      const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
      attendanceRate = presentCount / attendanceRecords.length;
    }

    // 2. Fetch Marks Data (Midterm and Quiz)
    const marksRecords = await Mark.find({ studentId });
    
    let midtermScore = 0.5;
    const midtermExams = marksRecords.filter(m => m.examType.toLowerCase() === 'midterm');
    if (midtermExams.length > 0) {
      const totalObtained = midtermExams.reduce((sum, m) => sum + m.marksObtained, 0);
      const totalPossible = midtermExams.reduce((sum, m) => sum + m.totalMarks, 0);
      midtermScore = totalObtained / totalPossible;
    }

    let quizRate = 0.5;
    const quizzes = marksRecords.filter(m => m.examType.toLowerCase() === 'quiz');
    if (quizzes.length > 0) {
      const totalObtained = quizzes.reduce((sum, m) => sum + m.marksObtained, 0);
      const totalPossible = quizzes.reduce((sum, m) => sum + m.totalMarks, 0);
      quizRate = totalObtained / totalPossible;
    }

    // 3. Get Prediction from ML Service
    const predictedGrade = predictPerformance(attendanceRate, midtermScore, quizRate);

    res.json({
      studentId,
      factors: {
        attendanceRate: parseFloat(attendanceRate.toFixed(2)),
        midtermScore: parseFloat(midtermScore.toFixed(2)),
        quizRate: parseFloat(quizRate.toFixed(2))
      },
      prediction: {
        predictedGrade: parseFloat(predictedGrade.toFixed(2)),
        status: predictedGrade > 0.75 ? 'Excellent' : predictedGrade > 0.5 ? 'Average' : 'At Risk'
      }
    });

  } catch (error) {
    console.error('ML Prediction Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
