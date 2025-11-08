import React, { useState } from 'react';
import { ExamIcon } from './icons';

interface ExamStartScreenProps {
  onStartExam: (questionCount: number) => void;
  onBack: () => void;
}

const ExamStartScreen: React.FC<ExamStartScreenProps> = ({ onStartExam, onBack }) => {
  const [questionCount, setQuestionCount] = useState(10);

  const timePerQuestion = 1.5; // 1.5 minutes
  const totalTime = questionCount * timePerQuestion;

  return (
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200 relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        &larr; Back to Dashboard
      </button>
      <div className="flex justify-center mb-4">
        <ExamIcon className="h-16 w-16 text-blue-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">Exam Simulation</h1>
      <p className="text-gray-600 text-lg mb-8">
        Test your knowledge under pressure with a timed exam.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Exam Settings</h3>
        
        <div className="mb-6">
          <label htmlFor="question-slider" className="block text-lg font-medium text-gray-700 mb-2">
            Number of Questions: <span className="font-bold text-blue-600">{questionCount}</span>
          </label>
          <input
            id="question-slider"
            type="range"
            min="10"
            max="60"
            step="10"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
           <div className="flex justify-between text-xs text-gray-500 w-full px-1 mt-1">
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
            <span>50</span>
            <span>60</span>
           </div>
        </div>

        <div className="text-lg text-gray-700">
          <p>This exam is timed.</p>
          <p>Total Time Allotted: <span className="font-bold text-red-600">{totalTime} minutes</span></p>
          <p className="text-sm text-gray-500">({timePerQuestion} minutes per question)</p>
        </div>

      </div>

      <button
        onClick={() => onStartExam(questionCount)}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      >
        Start Exam
      </button>
    </div>
  );
};

export default ExamStartScreen;
