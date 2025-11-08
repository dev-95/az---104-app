import React from 'react';
import { User, UserStats } from '../types';
import { LogoutIcon, UserIcon } from './icons';

interface AccountScreenProps {
    user: User;
    userStats: UserStats;
    onLogout: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ user, userStats, onLogout }) => {

    const passPercentage = userStats.totalAnswered > 0 
        ? Math.round((userStats.totalCorrect / userStats.totalAnswered) * 100) 
        : 0;

    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-600';
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200">
            <div className="flex flex-col items-center text-center">
                <UserIcon className="w-24 h-24 text-gray-400 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 mb-6">{user.email}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Your Stats Summary</h2>
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
                        <p className="text-gray-500 text-center py-4">No stats yet. Complete a quiz to get started!</p>
                    )}
                 </div>
            </div>

            <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg border border-red-200 transition-colors"
            >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
            </button>
        </div>
    );
};

export default AccountScreen;
