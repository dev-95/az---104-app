import React from 'react';
import clsx from 'clsx';
import { UserAnswer } from '../types';
import { CheckCircleIcon, XCircleIcon, TrophyIcon } from './icons';

interface ExamResultsScreenProps {
  answers: UserAnswer[];
  onRestart: () => void;
}

const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({ answers, onRestart }) => {
    const totalQuestions = answers.length;
    const score = answers.filter(a => a.isCorrect).length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    
    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-600';
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto border border-gray-200">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4"><TrophyIcon /></div>
                <h1 className="text-4xl font-bold text-blue-600">Exam Results</h1>
                <p className="text-2xl text-gray-700 mt-4">Your Score: 
                    <span className={`font-bold text-5xl ml-4 ${getPerformanceColor(percentage)}`}>{percentage}%</span>
                </p>
                <p className="text-gray-600 text-xl mt-2">({score} out of {totalQuestions} correct)</p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Question Breakdown</h2>
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
                >
                    Back to Main Menu
                </button>
            </div>
        </div>
    );
};

export default ExamResultsScreen;
