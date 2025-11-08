import React, { useState } from 'react';
import { AzureLogo, IdentityIcon, StorageIcon, ComputeIcon, NetworkingIcon, MonitorIcon } from './icons';
import { QuizMode, UserStats } from '../types';
import { AZ104_TOPICS } from '../constants';
import clsx from 'clsx';


interface QuizStartScreenProps {
  onStart: (mode: QuizMode, quizTopic: string, statsTopic: string) => void;
  onBack: () => void;
  userStats: UserStats;
}

const getTopicIcon = (topicName: string, className: string) => {
    switch (topicName) {
        case AZ104_TOPICS[0].name:
            return <IdentityIcon className={className} />;
        case AZ104_TOPICS[1].name:
            return <StorageIcon className={className} />;
        case AZ104_TOPICS[2].name:
            return <ComputeIcon className={className} />;
        case AZ104_TOPICS[3].name:
            return <NetworkingIcon className={className} />;
        case AZ104_TOPICS[4].name:
            return <MonitorIcon className={className} />;
        default:
            return null;
    }
}

const QuizStartScreen: React.FC<QuizStartScreenProps> = ({ onStart, onBack, userStats }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const handleTopicClick = (topicName: string) => {
    setExpandedTopic(prev => prev === topicName ? null : topicName);
  }

  return (
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-200">
      <button onClick={onBack} className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        &larr; Back to Dashboard
      </button>
      <div className="flex justify-center mb-4">
        <AzureLogo />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">Practice Mode</h1>
      <p className="text-gray-600 text-lg mb-8">
        Hone your skills with practice quizzes. Get instant feedback after every question.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-left">Focus on a specific topic</h2>
        <div className="space-y-3">
            {AZ104_TOPICS.map(topic => {
                const stats = userStats.topicStats[topic.name] || { totalCorrect: 0, totalAnswered: 0 };
                const percentage = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : null;
                const isExpanded = expandedTopic === topic.name;
                
                return (
                    <div key={topic.name} className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                        <button 
                            onClick={() => handleTopicClick(topic.name)}
                            className="w-full bg-gray-50 p-4 text-left flex items-center space-x-4 group"
                        >
                            <div className="flex-shrink-0">
                                {getTopicIcon(topic.name, "w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors")}
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-900 leading-tight">{topic.name}</p>
                                {percentage !== null ? (
                                    <div className="text-sm text-gray-500 mt-1">
                                        <span className="font-bold">{percentage}%</span> accuracy ({stats.totalAnswered} questions)
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-1">Practice to see your stats!</p>
                                )}
                            </div>
                             <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>
                        
                        {isExpanded && (
                            <div className="p-4 bg-white border-t border-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    <button onClick={() => onStart('topic', topic.name, topic.name)} className="w-full text-center py-2 px-3 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200 transition-colors">
                                        All {topic.name.split(' ')[2]}...
                                    </button>
                                    {topic.subTopics.map(subTopic => (
                                        <button key={subTopic} onClick={() => onStart('topic', subTopic, topic.name)} className="w-full text-center py-2 px-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                                            {subTopic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
         <h3 className="text-xl font-semibold text-gray-700 mb-4">Or, test your knowledge across all topics</h3>
         <button
            onClick={() => onStart('quick', 'All Topics', 'All Topics')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            Start Quick Quiz
          </button>
      </div>

    </div>
  );
};

export default QuizStartScreen;