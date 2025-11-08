import React from 'react';
import { UserStats } from '../types';
import { CalendarIcon } from './icons';

interface DashboardScreenProps {
    userStats: UserStats;
    onStartDailyQuiz: () => void;
    lastDailyQuizDate: string | null;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ userStats, onStartDailyQuiz, lastDailyQuizDate }) => {

    const passPercentage = userStats.totalAnswered > 0 
        ? Math.round((userStats.totalCorrect / userStats.totalAnswered) * 100) 
        : 0;

    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-600';
    }

    const today = new Date().toISOString().split('T')[0];
    const isDailyChallengeDone = lastDailyQuizDate === today;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-200">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Here's your AZ-104 study overview.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Overall Performance */}
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Overall Performance</h2>
                    {userStats.totalAnswered > 0 ? (
                    <div className="flex justify-around items-baseline">
                        <div>
                        <p className="text-gray-500 text-sm">OVERALL SCORE</p>
                        <p className={`text-5xl font-bold ${getPerformanceColor(passPercentage)}`}>{passPercentage}%</p>
                        </div>
                        <div className="border-l border-gray-300 h-16"></div>
                        <div>
                        <p className="text-gray-500 text-sm">QUESTIONS ANSWERED</p>
                        <p className="text-5xl font-bold text-gray-800">{userStats.totalAnswered}</p>
                        </div>
                    </div>
                    ) : (
                    <p className="text-gray-500 text-center py-8">Complete a quiz to see your stats here!</p>
                    )}
                </div>
                {/* Daily Challenge */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col text-center">
                  <div className="flex items-center justify-center mb-3">
                    <CalendarIcon className="h-7 w-7 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-semibold">Daily Challenge</h3>
                  </div>
                  <p className="text-gray-500 mb-4 flex-grow">A quick 5-question quiz available each day.</p>
                  <button
                    onClick={onStartDailyQuiz}
                    disabled={isDailyChallengeDone}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isDailyChallengeDone ? 'Completed Today' : 'Start Daily Quiz'}
                  </button>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance by Topic</h2>
                {userStats.topicStats && Object.keys(userStats.topicStats).length > 0 ? (
                    <div className="space-y-3">
                        {Object.keys(userStats.topicStats).map((topic) => {
                            const stats = userStats.topicStats[topic];
                            if (stats.totalAnswered === 0) return null;
                            const percentage = Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
                            return (
                                <div key={topic} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200">
                                    <div>
                                        <p className="font-medium text-gray-700">{topic}</p>
                                        <p className="text-sm text-gray-500">{stats.totalAnswered} questions answered</p>
                                    </div>
                                    <p className={`text-2xl font-bold ${getPerformanceColor(percentage)}`}>{percentage}%</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500">Complete a topic-focused quiz to see your breakdown here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardScreen;