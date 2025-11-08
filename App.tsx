import React, { useState, useCallback, useEffect } from 'react';
import { GameState, QuizQuestion, UserStats, QuizMode, AppMode, User, UserAnswer } from './types';
import { DAILY_QUIZ_LENGTH } from './constants';
import { generateAz104Quiz } from './services/geminiService';
import QuizStartScreen from './components/QuizStartScreen';
import Spinner from './components/Spinner';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import ExamResultsScreen from './components/ExamResultsScreen';
import BottomNavBar from './components/BottomNavBar';
import ExamStartScreen from './components/ExamStartScreen';
import AccountScreen from './components/AccountScreen';


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>('login');
  const [appMode, setAppMode] = useState<AppMode>('practice');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [examAnswers, setExamAnswers] = useState<UserAnswer[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<UserAnswer[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const [userStats, setUserStats] = useState<UserStats>({ totalCorrect: 0, totalAnswered: 0, topicStats: {} });
  const [lastDailyQuizDate, setLastDailyQuizDate] = useState<string | null>(null);

  // Load user from localStorage on initial mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('az104_user');
      if (savedUser) {
        const loggedInUser = JSON.parse(savedUser);
        handleLogin(loggedInUser);
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setGameState('dashboard');
    try {
        localStorage.setItem('az104_user', JSON.stringify(loggedInUser));
        // Load user-specific data
        const savedStats = localStorage.getItem(`az104_user_${loggedInUser.id}_stats`);
        if (savedStats) {
            const parsedStats = JSON.parse(savedStats);
            // Gracefully handle old data structure
            if (!parsedStats.topicStats) {
                parsedStats.topicStats = {};
            }
            setUserStats(parsedStats);
        }

        const savedDate = localStorage.getItem(`az104_user_${loggedInUser.id}_lastDaily`);
        if (savedDate) setLastDailyQuizDate(savedDate);
    } catch(e) {
        console.error("Failed to save user data", e);
    }
  };

  const handleLogout = () => {
    try {
        localStorage.removeItem('az104_user');
    } catch (e) {
        console.error("Failed to remove user from localStorage", e);
    }
    setUser(null);
    setGameState('login');
    setUserStats({ totalCorrect: 0, totalAnswered: 0, topicStats: {} });
    setLastDailyQuizDate(null);
  };
  
  // Save user-specific state to localStorage whenever it changes
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`az104_user_${user.id}_stats`, JSON.stringify(userStats));
      if (lastDailyQuizDate) {
        localStorage.setItem(`az104_user_${user.id}_lastDaily`, lastDailyQuizDate);
      }
    } catch (e) {
      console.error("Failed to save data to localStorage", e);
    }
  }, [userStats, lastDailyQuizDate, user]);

  const handleTimeUp = useCallback(() => {
    if (appMode !== 'exam') return;
    
    const finalScore = examAnswers.filter(a => a.isCorrect).length;
    setScore(finalScore);
    setUserStats(prev => ({
      totalCorrect: prev.totalCorrect + finalScore,
      totalAnswered: prev.totalAnswered + questions.length,
      topicStats: prev.topicStats,
    }));
    setGameState('results');
  }, [examAnswers, questions.length, appMode]);

  useEffect(() => {
    let intervalId: number | undefined;
    if (gameState === 'quiz' && appMode === 'exam' && timer > 0) {
      intervalId = window.setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (gameState === 'quiz' && appMode === 'exam' && timer === 0) {
      handleTimeUp();
    }
    return () => clearInterval(intervalId);
  }, [gameState, appMode, timer, handleTimeUp]);


  const startGame = useCallback(async (mode: QuizMode, quizTopic?: string, statsTopic?: string, questionCount?: number) => {
    setGameState('loading');
    setError(null);
    setCurrentTopic(statsTopic || null);

    const today = new Date().toISOString().split('T')[0];
    if (mode === 'daily' && lastDailyQuizDate === today) {
        setError("You've already completed the daily challenge for today. Come back tomorrow!");
        setGameState('dashboard');
        return;
    }

    try {
      // Fix: Add questionCount as a parameter and use it to determine the number of questions.
      const count = questionCount || (mode === 'daily' ? DAILY_QUIZ_LENGTH : 10);
      const newQuestions = await generateAz104Quiz(quizTopic, count, statsTopic);

      if (mode === 'daily') {
          setLastDailyQuizDate(today);
      }

      if (appMode === 'exam') {
        setTimer(count * 90); // 1.5 minutes per question
      }
      
      setQuestions(newQuestions);
      setScore(0);
      setCurrentQuestionIndex(0);
      setExamAnswers([]);
      setPracticeAnswers([]);
      setGameState('quiz');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setGameState(appMode === 'exam' ? 'exam-start' : 'practice-start');
    }
  }, [lastDailyQuizDate, appMode]);

  const handleAnswer = useCallback((selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentQuestionIndex].correctAnswerIndex;
    
    if (appMode === 'practice') {
        if (isCorrect) setScore(prev => prev + 1);
        setPracticeAnswers(prev => [...prev, {
            question: questions[currentQuestionIndex],
            selectedAnswerIndex: selectedIndex,
            isCorrect: isCorrect,
        }]);
        setUserStats(prev => {
            const newTotalCorrect = prev.totalCorrect + (isCorrect ? 1 : 0);
            const newTotalAnswered = prev.totalAnswered + 1;

            let newTopicStats = { ...prev.topicStats };
            if (currentTopic && currentTopic !== 'All Topics') {
                const topicStat = prev.topicStats[currentTopic] || { totalCorrect: 0, totalAnswered: 0 };
                newTopicStats[currentTopic] = {
                    totalCorrect: topicStat.totalCorrect + (isCorrect ? 1 : 0),
                    totalAnswered: topicStat.totalAnswered + 1
                };
            }

            return {
                totalCorrect: newTotalCorrect,
                totalAnswered: newTotalAnswered,
                topicStats: newTopicStats
            };
        });
    } else { // exam mode
        setExamAnswers(prev => [...prev, {
            question: questions[currentQuestionIndex],
            selectedAnswerIndex: selectedIndex,
            isCorrect: isCorrect,
        }]);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
        if(appMode === 'exam') {
            const finalScore = examAnswers.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
            setScore(finalScore);
             setUserStats(prev => ({
                totalCorrect: prev.totalCorrect + finalScore,
                totalAnswered: prev.totalAnswered + questions.length,
                topicStats: prev.topicStats // Exam mode is not topic-specific
            }));
        }
      setGameState('results');
    }
  }, [currentQuestionIndex, questions, appMode, examAnswers, currentTopic]);

  const restartGame = useCallback(() => {
    setGameState('dashboard');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setError(null);
    setCurrentTopic(null);
    setTimer(0);
    setExamAnswers([]);
    setPracticeAnswers([]);
  }, []);

  const handleNav = (target: GameState) => {
    setError(null);
    if (target === 'exam-start') {
        setAppMode('exam');
    } else if (target === 'practice-start' || target === 'dashboard' || target === 'account') {
        setAppMode('practice');
    }
    setGameState(target);
  }

  const renderContent = () => {
    if (!user || gameState === 'login') {
        return <LoginScreen onLogin={handleLogin} />;
    }

    switch (gameState) {
      case 'dashboard':
        return <DashboardScreen 
            userStats={userStats} 
            onStartDailyQuiz={() => {
                setAppMode('practice');
                startGame('daily');
            }}
            lastDailyQuizDate={lastDailyQuizDate}
        />;
       case 'account':
        return <AccountScreen 
          user={user}
          userStats={userStats}
          onLogout={handleLogout}
        />
      case 'practice-start':
        return <QuizStartScreen 
            userStats={userStats}
            onStart={(mode, quizTopic, statsTopic) => {
                setAppMode('practice');
                startGame(mode, quizTopic, statsTopic);
            }} 
            onBack={() => setGameState('dashboard')}
        />;
      case 'exam-start':
        return <ExamStartScreen 
            onStartExam={(questionCount) => {
                setAppMode('exam');
                startGame('quick', undefined, undefined, questionCount);
            }}
            onBack={() => setGameState('dashboard')}
        />;
      case 'loading':
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
      case 'quiz':
        return (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            mode={appMode}
            remainingTime={appMode === 'exam' ? timer : undefined}
          />
        );
      case 'results':
        if(appMode === 'exam') {
            return <ExamResultsScreen answers={examAnswers} onRestart={restartGame} />
        }
        return (
          <ResultsScreen
            score={score}
            totalQuestions={questions.length}
            onRestart={restartGame}
            answers={practiceAnswers}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 pb-28">
        <div className="w-full max-w-4xl relative">
        {error && (gameState === 'practice-start' || gameState === 'dashboard' || gameState === 'exam-start') && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-semibold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {renderContent()}
        </div>
        {user && !['loading', 'quiz', 'results', 'login'].includes(gameState) && (
            <BottomNavBar activeTab={gameState} onNavigate={handleNav} />
        )}
        <footer className="mt-8 text-sm text-gray-500 text-center">
            <p>Powered by Google Gemini. This is not an official Microsoft exam.</p>
        </footer>
    </main>
  );
};

export default App;
