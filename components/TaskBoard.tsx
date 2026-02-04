
import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  moveTask: (id: string, status: TaskStatus) => void;
  onAddTask: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-600' },
  { id: 'in-progress', label: 'Active Node', color: 'bg-cyan-500' },
  { id: 'review', label: 'Validation', color: 'bg-purple-500' },
  { id: 'done', label: 'Archived', color: 'bg-emerald-500' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, moveTask, onAddTask }) => {
  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, status);
  };

  return (
    <div className="flex gap-6 h-full min-h-[500px] pb-6">
      {COLUMNS.map(col => (
        <div 
          key={col.id} 
          className="flex flex-col gap-4 w-[300px] shrink-0"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${col.color} shadow-[0_0_8px_currentColor]`} />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{col.label}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 font-bold font-mono border border-slate-800">
                {getTasksByStatus(col.id).length}
              </span>
            </div>
            {col.id === 'backlog' && (
              <button 
                onClick={() => onAddTask({
                  id: Math.random().toString(36).substr(2, 5),
                  title: 'New Integration Node',
                  description: 'Awaiting neural configuration and system mapping.',
                  status: 'backlog',
                  priority: 'medium',
                  tags: ['Incoming']
                })}
                className="text-slate-600 hover:text-cyan-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1">
            {getTasksByStatus(col.id).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="group bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-grab active:cursor-grabbing shadow-sm backdrop-blur-sm flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {task.priority.toUpperCase()}
                  </div>
                  <div className="text-[9px] text-slate-700 font-mono">NODE_{task.id}</div>
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold bg-slate-950/50 border border-slate-800 px-2 py-0.5 rounded text-slate-600 uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {getTasksByStatus(col.id).length === 0 && (
              <div className="flex-1 border-2 border-dashed border-slate-900 rounded-2xl min-h-[150px] flex items-center justify-center bg-slate-950/20">
                <span className="text-slate-800 text-[10px] font-bold uppercase tracking-widest">Sector_Idle</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};