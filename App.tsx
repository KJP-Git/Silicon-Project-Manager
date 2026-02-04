
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskBoard } from './components/TaskBoard';
import { ThinkingLog } from './components/ThinkingLog';
import { Terminal } from './components/Terminal';
import { Task, TaskStatus, TerminalLog, FileItem } from './types';
import { analyzeArchitecture } from './services/gemini';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Implement Silicon-Kernel', description: 'Core system logic for resource management.', status: 'backlog', priority: 'high', tags: ['System', 'Core'] },
  { id: '2', title: 'Neural UI Refresh', description: 'Update components to use glassmorphism and neon accents.', status: 'in-progress', priority: 'medium', tags: ['UI/UX'] },
  { id: '3', title: 'Latency Optimization', description: 'Reduce API response time for live logs.', status: 'review', priority: 'low', tags: ['Performance'] },
  { id: '4', title: 'Database Migration', description: 'Move all project metadata to the new schema.', status: 'done', priority: 'high', tags: ['Database'] },
];

const INITIAL_FILES: FileItem[] = [
  {
    id: 'root',
    name: 'src',
    type: 'folder',
    children: [
      { id: '1', name: 'main.sys', type: 'file' },
      { id: '2', name: 'kernel.io', type: 'file' },
      { id: '3', name: 'ui-core', type: 'folder', children: [{ id: '3-1', name: 'Dashboard.tsx', type: 'file' }] },
    ]
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isLogExpanded, setIsLogExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const addLog = useCallback((message: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }].slice(-50));
  }, []);

  useEffect(() => {
    addLog('System initialized. Kernel stable.', 'success');
    addLog('Awaiting neural sync with Gemini Pro...', 'info');
  }, [addLog]);

  const handleFileSelect = (filename: string) => {
    addLog(`Accessing file: ${filename}`, 'info');
    addLog(`Running automated dependency audit on ${filename}...`, 'ai');
    setTimeout(() => {
      addLog(`Audit complete for ${filename}. No critical vulnerabilities found.`, 'success');
    }, 800);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    addLog(`Navigating to ${tab.toUpperCase()} module...`, 'info');
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addLog(`Task moved: "${task.title}" -> ${newStatus.toUpperCase()}`, 'info');
    }
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTask = (task: Task) => {
    addLog(`New task added: "${task.title}"`, 'success');
    setTasks(prev => [...prev, task]);
  };

  const handleAnalyzeArchitecture = async () => {
    addLog('Starting codebase architecture analysis...', 'ai');
    try {
      const suggestion = await analyzeArchitecture(INITIAL_FILES);
      addLog(`Architecture Suggestion: ${suggestion}`, 'ai');
    } catch (err) {
      addLog('Architecture analysis failed.', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onFileSelect={handleFileSelect} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-md bg-slate-950/50 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full glow-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              Autonomous PM
            </h1>
            <button 
              onClick={handleAnalyzeArchitecture}
              className="text-[10px] px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 font-mono border border-slate-800 transition-colors"
            >
              ANALYZE_ARCH
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLogExpanded(!isLogExpanded)}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              {isLogExpanded ? 'HIDE LOG' : 'SHOW LOG'}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 border border-white/20" />
          </div>
        </header>

        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
          <TaskBoard tasks={tasks} moveTask={moveTask} onAddTask={addTask} />
        </div>

        <Terminal logs={logs} />
      </main>

      <div className={`transition-all duration-300 ease-in-out border-l border-slate-800 shrink-0 ${isLogExpanded ? 'w-96' : 'w-0 overflow-hidden'}`}>
        <ThinkingLog currentTasks={tasks} fileStructure={INITIAL_FILES} onLog={addLog} />
      </div>
    </div>
  );
}