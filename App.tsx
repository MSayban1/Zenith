
import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, AppState, Task, Goal, Exercise, Note } from './types';
import Dashboard from './components/Dashboard';
import RoutineManager from './components/RoutineManager';
import GoalTracker from './components/GoalTracker';
import ExerciseRoutine from './components/ExerciseRoutine';
import StudySession from './components/StudySession';
import NotesSection from './components/NotesSection';

// Icons as components for cleaner UI
const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Routine: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/><circle cx="12" cy="12" r="3"/></svg>,
  Goals: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Study: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/><path d="M20 4v16"/></svg>,
  Exercise: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 .44-2.2a2.3 2.3 0 0 0-2.2-2.73l-8.5.1a2.3 2.3 0 0 0-2.23 2.76L6 22"/><path d="m2 13 2.15-.35a2.3 2.3 0 0 0 1.72-1.57L7.7 4.14a2.3 2.3 0 0 1 4.44.33l1.1 8.52a2.3 2.3 0 0 0 1.55 1.9l2.16.61"/></svg>,
  Notes: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
};

const STORAGE_KEY = 'zenith_discipline_state';

// Use a high-quality notification sound
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const defaultState: AppState = {
  routine: [
    { id: '1', text: 'Wake up at 6:00 AM', completed: false, time: '06:00' },
    { id: '2', text: 'Drink 500ml Water', completed: false, time: '06:15' },
    { id: '3', text: 'Read for 20 minutes', completed: false, time: '07:00' }
  ],
  goals: [
    { id: '1', title: 'Run a Marathon', type: 'long', progress: 15, targetDate: '2024-12-31' },
    { id: '2', title: 'Learn React Hooks', type: 'short', progress: 80, targetDate: '2024-06-15' }
  ],
  exercises: [
    { id: '1', name: 'Morning Yoga', duration: 15, completed: false, reminderTime: '06:30' },
    { id: '2', name: 'Evening Pushups', duration: 10, completed: false, reminderTime: '18:00' }
  ],
  notes: [
    { id: '1', title: 'Focus Tip', content: 'Deep work sessions are best early morning.', date: new Date().toLocaleDateString() }
  ],
  studyStats: {
    totalMinutes: 0,
    lastSession: 'Never'
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const triggerAlertFeedback = useCallback(() => {
    // Vibration (Pattern: buzz, pause, buzz)
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    // Sound
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.play().catch(e => console.log("Audio playback deferred until user interaction."));
  }, []);

  // Simple reminder checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const timeStr = `${currentHours}:${currentMinutes}`;

      state.exercises.forEach(ex => {
        if (ex.reminderTime === timeStr && !ex.completed) {
          sendNotification('Fit Reminder', `Time for ${ex.name}!`);
          triggerAlertFeedback();
        }
      });
      
      state.routine.forEach(task => {
        if (task.time === timeStr && !task.completed) {
          sendNotification('Routine Alert', `Time to: ${task.text}`);
          triggerAlertFeedback();
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.exercises, state.routine, triggerAlertFeedback]);

  const sendNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: 'https://picsum.photos/100/100' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard state={state} onNav={setActiveTab} />;
      case AppTab.ROUTINE:
        return <RoutineManager state={state} setState={setState} />;
      case AppTab.GOALS:
        return <GoalTracker state={state} setState={setState} />;
      case AppTab.EXERCISE:
        return <ExerciseRoutine state={state} setState={setState} />;
      case AppTab.STUDY:
        return <StudySession state={state} setState={setState} />;
      case AppTab.NOTES:
        return <NotesSection state={state} setState={setState} />;
      default:
        return <Dashboard state={state} onNav={setActiveTab} />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: AppTab, icon: React.FC, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 ${activeTab === tab ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
    >
      <div className={`${activeTab === tab ? 'bg-indigo-100 p-1.5 rounded-full' : ''}`}>
        <Icon />
      </div>
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden">
      {/* Status Bar Backdrop for Mobile */}
      <div className="h-safe-top bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Zenith</h1>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Live</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-200 safe-area-bottom flex items-center justify-around z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        <NavButton tab={AppTab.DASHBOARD} icon={Icons.Dashboard} label="Home" />
        <NavButton tab={AppTab.ROUTINE} icon={Icons.Routine} label="Routine" />
        <NavButton tab={AppTab.GOALS} icon={Icons.Goals} label="Goals" />
        <NavButton tab={AppTab.STUDY} icon={Icons.Study} label="Study" />
        <NavButton tab={AppTab.EXERCISE} icon={Icons.Exercise} label="Fit" />
        <NavButton tab={AppTab.NOTES} icon={Icons.Notes} label="Notes" />
      </nav>
    </div>
  );
};

export default App;
