
import React, { useState } from 'react';
import { AppState, Task } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const RoutineManager: React.FC<Props> = ({ state, setState }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00');

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      routine: prev.routine.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      time: newTaskTime
    };
    setState(prev => ({ ...prev, routine: [...prev.routine, newTask] }));
    setNewTaskText('');
  };

  const deleteTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Immediate state update
    setState(prev => {
      const updated = prev.routine.filter(t => t.id !== id);
      return { ...prev, routine: updated };
    });
  };

  const clearAllTasks = () => {
    try {
      if (window.confirm('CRITICAL: This will permanently delete ALL tasks in your routine. Proceed?')) {
        setState(prev => ({ ...prev, routine: [] }));
      }
    } catch (e) {
      setState(prev => ({ ...prev, routine: [] }));
    }
  };

  const resetProgress = () => {
    try {
      if (window.confirm('Reset all tasks to incomplete for the new day?')) {
        setState(prev => ({
          ...prev,
          routine: prev.routine.map(t => ({ ...t, completed: false }))
        }));
      }
    } catch (e) {
      setState(prev => ({
        ...prev,
        routine: prev.routine.map(t => ({ ...t, completed: false }))
      }));
    }
  };

  const sortedRoutine = [...state.routine].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Routine</h2>
          <p className="text-sm text-slate-500">Master your day with precision.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <button 
             type="button"
             onClick={resetProgress} 
             className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full active:bg-indigo-100 transition-colors"
           >
             Reset Day
           </button>
           <button 
             type="button"
             onClick={clearAllTasks} 
             className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full active:bg-red-100 transition-colors border border-red-100"
           >
             Clear All
           </button>
        </div>
      </div>

      <form onSubmit={addTask} className="space-y-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <input 
          type="text" 
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          placeholder="New routine task..." 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 font-medium"
        />
        <div className="flex gap-2">
          <input 
            type="time" 
            value={newTaskTime}
            onChange={e => setNewTaskTime(e.target.value)}
            className="px-4 py-3 bg-slate-50 rounded-2xl flex-1 outline-none text-slate-600 font-bold"
          />
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">Add</button>
        </div>
      </form>

      <div className="space-y-3">
        {sortedRoutine.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 text-sm font-medium">Your routine is currently empty.</p>
          </div>
        ) : (
          sortedRoutine.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center p-4 bg-white border ${task.completed ? 'border-indigo-100 opacity-60' : 'border-slate-100'} rounded-2xl shadow-sm transition-all`}
            >
              <button 
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${task.completed ? 'bg-indigo-600 border-indigo-600 scale-90 shadow-md' : 'border-slate-300 hover:border-indigo-300'}`}
              >
                {task.completed && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
              <div className="flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                <p className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.05em]">{task.time}</p>
              </div>
              <button 
                type="button"
                onClick={(e) => deleteTask(e, task.id)} 
                className="text-red-400 hover:text-red-600 transition-all p-3 active:scale-150 z-20"
                title="Delete item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoutineManager;
