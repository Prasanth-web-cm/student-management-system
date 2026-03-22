const MultivariateLinearRegression = require('ml-regression-multivariate-linear');

/**
 * ML Service for Student Performance Evaluation
 * Uses Multivariate Linear Regression to predict final grades.
 */

// Mock training data for initial model
// Input: [Attendance Rate (0.0-1.0), Midterm Marks (0.0-1.0), Quiz Completion (0.0-1.0)]
// Output: [Predicted Final Grade (0.0-1.0)]
const x = [
  [0.95, 0.90, 1.0], // Excellent student
  [0.80, 0.70, 0.8], // Average student
  [0.60, 0.50, 0.4], // Struggling student
  [0.90, 0.40, 0.7], // Good attendance, poor midterm
  [0.40, 0.80, 0.5], // Poor attendance, good midterm
];

const y = [
  [0.95],
  [0.75],
  [0.45],
  [0.65],
  [0.60],
];

let regressor;

const trainModel = () => {
  regressor = new MultivariateLinearRegression(x, y);
  console.log('ML Model trained successfully.');
};

// Train on load
trainModel();

/**
 * Predict student performance
 * @param {number} attendanceRate - 0 to 1
 * @param {number} midtermScore - 0 to 1
 * @param {number} quizRate - 0 to 1
 * @returns {number} Predicted score (0 to 1)
 */
const predictPerformance = (attendanceRate, midtermScore, quizRate) => {
  if (!regressor) trainModel();
  
  const prediction = regressor.predict([attendanceRate, midtermScore, quizRate]);
  // Clamp prediction between 0 and 1
  return Math.max(0, Math.min(1, prediction[0]));
};

module.exports = {
  predictPerformance,
  trainModel
};
