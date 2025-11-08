import React from 'react';
import { AzureLogo, GoogleIcon } from './icons';
import { User } from '../types';

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    
    const handleLoginClick = () => {
        // This is a mock login. In a real app, this would trigger the OAuth flow.
        const mockUser: User = {
            id: '12345-abcde',
            name: 'Azure Learner',
            email: 'learner@example.com',
        };
        onLogin(mockUser);
    };

    return (
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto border border-gray-200">
            <div className="flex justify-center mb-4">
                <AzureLogo />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Welcome to AZ-104 Exam Prep AI</h1>
            <p className="text-gray-600 text-lg mb-8">
                Your AI-powered study partner for the Microsoft Azure Administrator exam.
            </p>
            <button
                onClick={handleLoginClick}
                className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg transition-all border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <GoogleIcon />
                Sign in with Google
            </button>
            <p className="text-xs text-gray-400 mt-6">
                A simulated sign-in is used to save your progress locally in your browser.
            </p>
        </div>
    );
}

export default LoginScreen;
