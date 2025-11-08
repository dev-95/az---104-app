import React from 'react';
import { TrophyIcon } from './icons';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getFeedback = () => {
    if (percentage >= 80) return "Excellent! You're well on your way to mastering AZ-104 concepts.";
    if (percentage >= 50) return "Good effort! Keep studying the areas you missed.";
    return "Don't give up! Review the explanations and try again. Practice makes perfect.";
  };

  return (
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200">
      <div className="flex justify-center mb-6">
        <TrophyIcon />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Quiz Complete!</h1>
      <p className="text-2xl text-gray-700 mb-2">Your Score:</p>
      <p className="text-6xl font-bold text-gray-900 mb-4">
        {score} <span className="text-3xl text-gray-500">/ {totalQuestions}</span>
      </p>
      <p className="text-3xl font-semibold text-yellow-500 mb-6">({percentage}%)</p>
      <p className="text-gray-600 text-lg mb-8">{getFeedback()}</p>
      <button
        onClick={onRestart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      >
        Try Another Quiz
      </button>
    </div>
  );
};

export default ResultsScreen;