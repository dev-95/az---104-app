import React from 'react';
import clsx from 'clsx';
import { UserAnswer } from '../types';
import { TrophyIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  answers: UserAnswer[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart, answers }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getFeedback = () => {
    if (percentage >= 80) return "Excellent! You're well on your way to mastering AZ-104 concepts.";
    if (percentage >= 50) return "Good effort! Keep studying the areas you missed.";
    return "Don't give up! Review the explanations and try again. Practice makes perfect.";
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto border border-gray-200">
      <div className="text-center mb-8">
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
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Question Review</h2>
        {answers.map((answer, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start">
                    <div className="mr-4 mt-1">
                        {answer.isCorrect 
                            ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> 
                            : <XCircleIcon className="h-6 w-6 text-red-500" />
                        }
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{index + 1}. {answer.question.question}</p>
                        <div className="mt-3 space-y-2 text-sm">
                            {answer.question.options.map((option, optIndex) => (
                                <div key={optIndex} className={clsx("p-2 rounded border", {
                                    "bg-red-100 border-red-300": !answer.isCorrect && optIndex === answer.selectedAnswerIndex,
                                    "bg-green-100 border-green-300": optIndex === answer.question.correctAnswerIndex,
                                })}>
                                    <p className={clsx({
                                        "font-semibold": optIndex === answer.question.correctAnswerIndex || optIndex === answer.selectedAnswerIndex
                                    })}>{option}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="font-semibold text-sm text-gray-600">Explanation:</p>
                            <p className="text-sm text-gray-600 mt-1">{answer.question.explanation}</p>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          Try Another Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
