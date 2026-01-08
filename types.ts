
export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  ROUTINE = 'ROUTINE',
  GOALS = 'GOALS',
  STUDY = 'STUDY',
  EXERCISE = 'EXERCISE',
  NOTES = 'NOTES'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
  alarmEnabled?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'short' | 'mid' | 'long';
  progress: number; // 0 to 100
  targetDate?: string;
}

export interface Exercise {
  id: string;
  name: string;
  duration: number; // in minutes
  completed: boolean;
  reminderTime?: string;
  alarmEnabled?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface AppState {
  routine: Task[];
  goals: Goal[];
  exercises: Exercise[];
  notes: Note[];
  studyStats: {
    totalMinutes: number;
    lastSession: string;
  };
  snoozedItems: Record<string, string>; // ID -> Time string (HH:mm)
}
