
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const StudySession: React.FC<Props> = ({ state, setState }) => {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<number | null>(null);

  const triggerSensoryAlert = () => {
    // Vibration
    if ("vibrate" in navigator) {
      navigator.vibrate([400, 200, 400]);
    }
    // Sound
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Sync timeLeft when minutes are adjusted and timer is inactive
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(isBreak ? breakMinutes * 60 : focusMinutes * 60);
    }
  }, [focusMinutes, breakMinutes, isBreak, isActive]);

  const handleComplete = () => {
    setIsActive(false);
    triggerSensoryAlert();
    
    if (!isBreak) {
      // Session finished
      setState(prev => ({
        ...prev,
        studyStats: {
          totalMinutes: prev.studyStats.totalMinutes + focusMinutes,
          lastSession: new Date().toLocaleTimeString()
        }
      }));
      if (Notification.permission === 'granted') {
        new Notification('Zenith Focus', { body: `Focus session of ${focusMinutes}m finished! Time for a break.` });
      }
      setIsBreak(true);
      setTimeLeft(breakMinutes * 60);
    } else {
      // Break finished
      if (Notification.permission === 'granted') {
        new Notification('Zenith Focus', { body: 'Break over! Ready to focus again?' });
      }
      setIsBreak(false);
      setTimeLeft(focusMinutes * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(focusMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustMinutes = (type: 'focus' | 'break', amount: number) => {
    if (isActive) return; // Prevent adjustment while running
    if (type === 'focus') {
      setFocusMinutes(prev => Math.max(1, Math.min(120, prev + amount)));
    } else {
      setBreakMinutes(prev => Math.max(1, Math.min(60, prev + amount)));
    }
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Deep Work</h2>
        <p className="text-sm text-slate-500">Master your attention span.</p>
      </header>

      {/* Settings Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus Time</span>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustMinutes('focus', -5)} disabled={isActive} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-30">-</button>
            <span className="font-bold text-slate-700 w-8 text-center">{focusMinutes}m</span>
            <button onClick={() => adjustMinutes('focus', 5)} disabled={isActive} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-30">+</button>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Break Time</span>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustMinutes('break', -1)} disabled={isActive} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-30">-</button>
            <span className="font-bold text-slate-700 w-8 text-center">{breakMinutes}m</span>
            <button onClick={() => adjustMinutes('break', 1)} disabled={isActive} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-30">+</button>
          </div>
        </div>
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center py-4">
        <div className={`w-64 h-64 rounded-full border-8 flex flex-col items-center justify-center relative transition-all duration-1000 ${isBreak ? 'border-green-100 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'border-indigo-100 shadow-[0_0_40px_rgba(99,102,241,0.1)]'}`}>
          <span className={`text-sm font-black uppercase tracking-widest ${isBreak ? 'text-green-500' : 'text-indigo-500'}`}>
            {isBreak ? 'Taking a Break' : 'Deeply Focusing'}
          </span>
          <span className="text-6xl font-black text-slate-800 tabular-nums z-10">{formatTime(timeLeft)}</span>
          {/* Animated Wave Backdrop */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-5 pointer-events-none">
            <div 
              className={`absolute bottom-0 left-0 right-0 ${isBreak ? 'bg-green-500' : 'bg-indigo-500'} transition-all duration-1000`} 
              style={{ height: `${(timeLeft / (isBreak ? breakMinutes * 60 : focusMinutes * 60)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className={`flex-1 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all ${isActive ? 'bg-slate-200 text-slate-600' : (isBreak ? 'bg-green-600 shadow-green-100' : 'bg-indigo-600 shadow-indigo-100') + ' text-white'}`}
        >
          {isActive ? 'Pause Session' : 'Start Timer'}
        </button>
        <button 
          onClick={resetTimer}
          className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-400 active:scale-95 transition-transform"
        >
          Reset
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Mastery</p>
          <p className="text-3xl font-black text-slate-800">{state.studyStats.totalMinutes} <span className="text-sm font-normal text-slate-400 lowercase">min</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Run</p>
          <p className="text-xs font-bold text-slate-600">{state.studyStats.lastSession}</p>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
