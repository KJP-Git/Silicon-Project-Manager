
import React, { useState, useEffect, useRef } from 'react';
import { Task, ThinkingPlan, FileItem } from '../types';
import { getGeminiPlan } from '../services/gemini';

interface ThinkingLogProps {
  currentTasks: Task[];
  fileStructure: FileItem[];
  onLog: (msg: string, type?: any) => void;
}

export const ThinkingLog: React.FC<ThinkingLogProps> = ({ currentTasks, fileStructure, onLog }) => {
  const [plans, setPlans] = useState<ThinkingPlan[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchPlans = async () => {
    setIsSyncing(true);
    onLog('Neural engine recalibrating...', 'ai');
    const newPlans = await getGeminiPlan(currentTasks, fileStructure);
    if (newPlans && newPlans.length > 0) {
      setPlans(prev => [...newPlans, ...prev].slice(0, 15));
      onLog(`Sync complete. Identified ${newPlans.length} optimization vectors.`, 'ai');
    }
    setIsSyncing(false);
    setLastSync(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchPlans();
    const interval = setInterval(fetchPlans, 45000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [plans]);

  return (
    <div className="h-full flex flex-col bg-[#020617]">
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-800'}`} />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Cognitive Stack</h2>
        </div>
        <span className="text-[10px] mono font-bold text-slate-700">{lastSync}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
        {plans.length === 0 && !isSyncing && (
          <div className="flex flex-col items-center justify-center h-full text-slate-800">
            <p className="text-[10px] mono uppercase tracking-widest font-bold">Awaiting neural patterns...</p>
          </div>
        )}

        {plans.map((plan, idx) => (
          <div key={idx} className="flex flex-col gap-3 group border-l-2 border-slate-900 pl-6 relative">
             <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-800 group-hover:border-cyan-500 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold mono text-cyan-500/40 uppercase tracking-tighter">Protocol_Node_{plans.length - idx}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="space-y-1">
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{plan.thought}"
                </p>
              </div>
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 group-hover:border-purple-500/30 transition-all">
                <div className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-2 opacity-70">Execution Branch</div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {plan.action}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="p-5 border-t border-slate-800/60 bg-black/40">
        <button 
          onClick={fetchPlans}
          disabled={isSyncing}
          className="w-full py-3 bg-slate-900/50 hover:bg-slate-800/50 disabled:opacity-50 text-slate-400 text-[10px] font-black mono uppercase tracking-widest rounded-xl border border-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:text-cyan-400 hover:border-cyan-500/30"
        >
          {isSyncing ? (
            <>
              <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              Recalculating...
            </>
          ) : 'Re-Calculate Logic'}
        </button>
      </div>
    </div>
  );
};