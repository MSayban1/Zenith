
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppTab, AppState, Task, Goal, Exercise, Note } from './types';
import Dashboard from './components/Dashboard';
import RoutineManager from './components/RoutineManager';
import GoalTracker from './components/GoalTracker';
import ExerciseRoutine from './components/ExerciseRoutine';
import StudySession from './components/StudySession';
import NotesSection from './components/NotesSection';

const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Routine: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/><circle cx="12" cy="12" r="3"/></svg>,
  Goals: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Study: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/><path d="M20 4v16"/></svg>,
  Exercise: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 .44-2.2a2.3 2.3 0 0 0-2.2-2.73l-8.5.1a2.3 2.3 0 0 0-2.23 2.76L6 22"/><path d="m2 13 2.15-.35a2.3 2.3 0 0 0 1.72-1.57L7.7 4.14a2.3 2.3 0 0 1 4.44.33l1.1 8.52a2.3 2.3 0 0 0 1.55 1.9l2.16.61"/></svg>,
  Notes: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
};

const STORAGE_KEY = 'zenith_discipline_state_v4';
const ALARM_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const defaultState: AppState = {
  routine: [
    { id: '1', text: 'Wake up at 6:00 AM', completed: false, time: '06:00', alarmEnabled: true },
    { id: '2', text: 'Daily Planning', completed: false, time: '08:00', alarmEnabled: true }
  ],
  goals: [],
  exercises: [
    { id: 'ex1', name: 'Intense HIIT', duration: 20, completed: false, reminderTime: '07:30', alarmEnabled: true }
  ],
  notes: [],
  studyStats: { totalMinutes: 0, lastSession: 'Never' },
  snoozedItems: {}
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  });
  const [ringingItem, setRingingItem] = useState<{ id: string, title: string, type: 'routine' | 'exercise' | 'timer' } | null>(null);
  
  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (ringingItem) {
      if (!alarmAudio.current) {
        alarmAudio.current = new Audio(ALARM_SOUND_URL);
        alarmAudio.current.loop = true;
      }
      alarmAudio.current.play().catch(console.error);
      if ("vibrate" in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    } else {
      if (alarmAudio.current) {
        alarmAudio.current.pause();
        alarmAudio.current.currentTime = 0;
      }
      if ("vibrate" in navigator) navigator.vibrate(0);
    }
  }, [ringingItem]);

  const sendAlarmNotification = (id: string, title: string, body: string) => {
    if (Notification.permission === 'granted') {
      const options = {
        body,
        icon: 'https://picsum.photos/100/100',
        tag: 'zenith-alarm-' + id,
        renotify: true,
        requireInteraction: true,
        data: { id },
        actions: [
          { action: 'snooze', title: 'Snooze (5m)' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      };
      new Notification(title, options);
    }
  };

  // Main Background Clock & Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Update running exercise timer
      if (state.activeExerciseTimer) {
        setState(prev => {
          if (!prev.activeExerciseTimer) return prev;
          const nextSeconds = prev.activeExerciseTimer.secondsLeft - 1;
          
          if (nextSeconds <= 0) {
            const ex = prev.exercises.find(e => e.id === prev.activeExerciseTimer?.id);
            if (ex && !ringingItem) {
              setRingingItem({ id: ex.id, title: `Timer Finished: ${ex.name}`, type: 'timer' });
              sendAlarmNotification(ex.id, 'Exercise Complete!', ex.name);
            }
            return { ...prev, activeExerciseTimer: undefined };
          }
          
          return {
            ...prev,
            activeExerciseTimer: {
              ...prev.activeExerciseTimer,
              secondsLeft: nextSeconds
            }
          };
        });
      }

      // Check Routine & Exercise Alarms (Reminder Times)
      state.routine.forEach(task => {
        if (!task.completed && task.alarmEnabled && (task.time === timeStr || state.snoozedItems[task.id] === timeStr)) {
          if (!ringingItem || ringingItem.id !== task.id) {
            setRingingItem({ id: task.id, title: task.text, type: 'routine' });
            sendAlarmNotification(task.id, 'Zenith Routine', task.text);
          }
        }
      });

      state.exercises.forEach(ex => {
        if (!ex.completed && ex.alarmEnabled && (ex.reminderTime === timeStr || state.snoozedItems[ex.id] === timeStr)) {
          if (!ringingItem || (ringingItem.id !== ex.id && ringingItem.type !== 'timer')) {
            setRingingItem({ id: ex.id, title: ex.name, type: 'exercise' });
            sendAlarmNotification(ex.id, 'Zenith Fitness', `Time for ${ex.name}`);
          }
        }
      });
    }, 1000); // Check every second for timer accuracy

    return () => clearInterval(interval);
  }, [state, ringingItem]);

  const handleSnooze = () => {
    if (!ringingItem) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const snoozeTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setState(prev => ({
      ...prev,
      snoozedItems: { ...prev.snoozedItems, [ringingItem.id]: snoozeTime }
    }));
    setRingingItem(null);
  };

  const handleDismiss = () => {
    if (!ringingItem) return;
    setState(prev => {
      const newSnoozed = { ...prev.snoozedItems };
      delete newSnoozed[ringingItem.id];
      return { ...prev, snoozedItems: newSnoozed };
    });
    setRingingItem(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard state={state} onNav={setActiveTab} />;
      case AppTab.ROUTINE: return <RoutineManager state={state} setState={setState} />;
      case AppTab.GOALS: return <GoalTracker state={state} setState={setState} />;
      case AppTab.EXERCISE: return <ExerciseRoutine state={state} setState={setState} />;
      case AppTab.STUDY: return <StudySession state={state} setState={setState} />;
      case AppTab.NOTES: return <NotesSection state={state} setState={setState} />;
      default: return <Dashboard state={state} onNav={setActiveTab} />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: AppTab, icon: React.FC, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 ${activeTab === tab ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
    >
      <div className={`${activeTab === tab ? 'bg-indigo-100 p-1.5 rounded-full shadow-inner' : ''}`}>
        <Icon />
      </div>
      <span className="text-[10px] mt-1 font-bold">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden">
      {ringingItem && (
        <div className="fixed inset-0 z-[100] bg-indigo-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <h2 className="text-white text-3xl font-black text-center mb-2 uppercase tracking-tighter">Zenith Alert</h2>
          <p className="text-indigo-200 text-lg font-bold text-center mb-12 px-4">{ringingItem.title}</p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={handleDismiss}
              className="w-full bg-white text-indigo-900 py-5 rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all"
            >
              DISMISS
            </button>
            {ringingItem.type !== 'timer' && (
              <button 
                onClick={handleSnooze}
                className="w-full bg-indigo-500/30 text-white border border-white/20 py-5 rounded-3xl font-black text-xl active:scale-95 transition-all"
              >
                SNOOZE (5M)
              </button>
            )}
          </div>
        </div>
      )}

      <div className="h-safe-top bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <h1 className="text-xl font-black text-indigo-600 tracking-tighter italic">ZENITH</h1>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disciplined</span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-200 safe-area-bottom flex items-center justify-around z-50 shadow-[0_-4px_25px_-10px_rgba(0,0,0,0.1)]">
        <NavButton tab={AppTab.DASHBOARD} icon={Icons.Dashboard} label="Home" />
        <NavButton tab={AppTab.ROUTINE} icon={Icons.Routine} label="Routine" />
        <NavButton tab={AppTab.GOALS} icon={Icons.Goals} label="Goals" />
        <NavButton tab={AppTab.STUDY} icon={Icons.Study} label="Study" />
        <NavButton tab={AppTab.EXERCISE} icon={Icons.Exercise} label="Fit" />
        <NavButton tab={AppTab.NOTES} icon={Icons.Notes} label="Journal" />
      </nav>
    </div>
  );
};

export default App;
