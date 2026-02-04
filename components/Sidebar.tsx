
import React, { useState } from 'react';
import { FileItem } from '../types';

const FILE_STRUCTURE: FileItem[] = [
  {
    id: 'root',
    name: 'src',
    type: 'folder',
    children: [
      { id: '1', name: 'main.sys', type: 'file' },
      { id: '2', name: 'kernel.io', type: 'file' },
      { 
        id: '3', 
        name: 'ui-core', 
        type: 'folder',
        children: [
          { id: '3-1', name: 'Dashboard.tsx', type: 'file' },
          { id: '3-2', name: 'Theme.config', type: 'file' },
        ]
      },
    ]
  },
  { id: '4', name: 'package.silicon', type: 'file' },
  { id: '5', name: 'assets', type: 'folder', children: [] },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onFileSelect: (filename: string) => void;
}

const ExplorerItem: React.FC<{ 
  item: FileItem; 
  depth?: number; 
  onFileSelect: (n: string) => void;
}> = ({ item, depth = 0, onFileSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === 'folder';

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-800/40 group transition-all`}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onFileSelect(item.name);
        }}
      >
        <span className="text-slate-600">
          {isFolder ? (
            <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 opacity-40 group-hover:text-cyan-400 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
        </span>
        <span className={`text-[11px] truncate transition-colors ${isFolder ? 'font-bold text-slate-500 uppercase tracking-tighter' : 'text-slate-500 group-hover:text-cyan-300'}`}>
          {item.name}
        </span>
      </div>
      {isFolder && isOpen && item.children && (
        <div>
          {item.children.map(child => (
            <ExplorerItem key={child.id} item={child} depth={depth + 1} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onFileSelect }) => {
  const navItems = ['Dashboard', 'Team', 'Project Hub', 'Deployments'];

  return (
    <aside className="w-64 border-r border-slate-800/60 flex flex-col bg-[#020617] z-20 shrink-0">
      <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all cursor-pointer">
            S
          </div>
          <span className="font-black text-lg tracking-tighter text-white group-hover:text-cyan-400 transition-colors">SILICON</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((link) => {
            const isActive = activeTab === link;
            return (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all relative overflow-hidden group ${
                  isActive ? 'bg-cyan-500/10 text-cyan-100 font-bold' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
                <div className={`w-1 h-1 rounded-full transition-all ${isActive ? 'bg-cyan-400 scale-150 shadow-[0_0_4px_#22d3ee]' : 'bg-transparent'}`} />
                <span className="text-xs uppercase tracking-widest">{link}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Workspace</span>
            <button className="text-slate-700 hover:text-cyan-500 transition-colors">+</button>
          </div>
          <div className="flex flex-col gap-0.5">
            {FILE_STRUCTURE.map(item => (
              <ExplorerItem key={item.id} item={item} onFileSelect={onFileSelect} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-800/40 bg-slate-950/20 backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-[9px] text-slate-600 mono font-bold">
            <span>CORE_LOAD</span>
            <span className="text-cyan-500">42%</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 w-[42%] shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-1000" 
              style={{ width: `${30 + Math.random() * 20}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-600 mono">
            <span>NEURAL_SYNC</span>
            <span className="text-emerald-500 animate-pulse font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};