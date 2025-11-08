import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { QuizQuestion, AppMode } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
  mode: AppMode;
  remainingTime?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, totalQuestions, onAnswer, mode, remainingTime }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false); // Only used for practice mode

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);

  const handleSelectAnswer = (index: number) => {
    if (mode === 'practice' && isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    if (mode === 'practice') {
      setIsAnswered(true);
      setTimeout(() => onAnswer(selectedAnswer), 1500); // Wait for user to see feedback
    } else {
      onAnswer(selectedAnswer);
    }
  };

  const getOptionClass = (index: number) => {
    const isPracticeMode = mode === 'practice';
    const isExamMode = mode === 'exam';

    // Base classes
    let classes = 'bg-white hover:bg-gray-100 border border-gray-300';

    // Selection class (for both modes before submitting in practice)
    if (selectedAnswer === index) {
       classes = 'bg-blue-200 border-blue-500 ring-2 ring-blue-400';
    }
    
    // Feedback classes (practice mode only, after submission)
    if (isPracticeMode && isAnswered) {
        if (index === question.correctAnswerIndex) {
            return 'bg-green-100 border-green-500 text-green-800';
        }
        if (index === selectedAnswer && index !== question.correctAnswerIndex) {
            return 'bg-red-100 border-red-500 text-red-800';
        }
        return 'bg-gray-100 border-gray-300 opacity-70';
    }

    return classes;
  };

   const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-3xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
            <p className="text-blue-600 font-semibold">Question {questionNumber} / {totalQuestions}</p>
        </div>
        {mode === 'exam' && typeof remainingTime !== 'undefined' && (
            <div className="text-red-600 font-bold text-lg bg-red-100 border border-red-300 px-3 py-1 rounded-md">
                Time: {formatTime(remainingTime)}
            </div>
        )}
      </div>
       <h2 className="text-xl md:text-2xl font-semibold mt-2 text-gray-900">{question.question}</h2>


      <div className="space-y-4 mt-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            disabled={mode === 'practice' && isAnswered}
            className={clsx(
                'w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center justify-between',
                getOptionClass(index)
            )}
          >
            <span className="flex-grow text-gray-800">{option}</span>
            {mode === 'practice' && isAnswered && index === question.correctAnswerIndex && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
            {mode === 'practice' && isAnswered && index === selectedAnswer && index !== question.correctAnswerIndex && <XCircleIcon className="h-6 w-6 text-red-600" />}
          </button>
        ))}
      </div>

      {mode === 'practice' && isAnswered && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <h3 className="font-semibold text-lg text-gray-800">Explanation:</h3>
          <p className="mt-2 text-gray-600">{question.explanation}</p>
        </div>
      )}

      {!(mode === 'practice' && isAnswered) && (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {mode === 'practice' ? 'Submit Answer' : 'Next Question'}
        </button>
      )}
    </div>
  );
};

export default QuestionCard;