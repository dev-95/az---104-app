import React from 'react';
import clsx from 'clsx';
import { GameState } from '../types';
import { DashboardIcon, PracticeIcon, ExamIcon, UserIcon } from './icons';

interface BottomNavBarProps {
    activeTab: GameState;
    onNavigate: (target: GameState) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onNavigate }) => {
    const navItems = [
        { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard', target: 'dashboard' },
        { id: 'practice', icon: PracticeIcon, label: 'Practice', target: 'practice-start' },
        { id: 'exam', icon: ExamIcon, label: 'Exam', target: 'exam-start' },
        { id: 'account', icon: UserIcon, label: 'Account', target: 'account' },
    ];

    const getIsActive = (itemTarget: GameState) => {
         return activeTab === itemTarget;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto flex justify-around">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.target as GameState)}
                        className={clsx(
                            'flex flex-col items-center justify-center w-full pt-3 pb-2 text-sm font-medium transition-colors',
                            getIsActive(item.target as GameState) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                        )}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span>{item.label}</span>
                         {getIsActive(item.target as GameState) && <div className="w-8 h-1 bg-blue-600 rounded-full mt-1"></div>}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavBar;