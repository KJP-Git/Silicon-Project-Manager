
import React, { useEffect, useRef } from 'react';
import { TerminalLog } from '../types';

interface TerminalProps {
  logs: TerminalLog[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 border-t border-slate-900 h-48 flex flex-col font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <span className="text-slate-600 uppercase tracking-widest text-[9px] font-black ml-2">System Terminal - v1.0.4-LTS</span>
        </div>
        <div className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">BAUD: 115200</div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1.5 terminal-scroll"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-left-1 duration-300">
            <span className="text-slate-700 shrink-0 select-none">[{log.timestamp}]</span>
            <span className={`${
              log.type === 'error' ? 'text-red-500' :
              log.type === 'success' ? 'text-emerald-500' :
              log.type === 'ai' ? 'text-cyan-400' :
              'text-slate-400'
            }`}>
              {log.type === 'ai' && <span className="mr-2">🤖</span>}
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-slate-800 italic uppercase tracking-tighter">Initializing core stream...</div>}
      </div>
    </div>
  );
};