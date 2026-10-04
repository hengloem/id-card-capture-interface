import React, { useState } from 'react';
import { Copy, Check, Code2, Package, Settings, Palette } from 'lucide-react';
import type { Theme } from '../utils/themes';
import { REACT_SNIPPETS, ANGULAR_SNIPPETS, type CodeSnippet } from '../utils/codeSnippets';

type Framework = 'react' | 'angular';

const ICON_MAP: Record<string, React.ReactNode> = {
  package: <Package className="w-4 h-4" />,
  code: <Code2 className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  palette: <Palette className="w-4 h-4" />,
};

interface CodePanelProps {
  theme: Theme;
}

const CodePanel: React.FC<CodePanelProps> = ({ theme }) => {
  const [framework, setFramework] = useState<Framework>('react');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const snippets: CodeSnippet[] =
    framework === 'react' ? REACT_SNIPPETS : ANGULAR_SNIPPETS;
  const current = snippets[activeIndex];
  const code = current.code(theme);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may not be available
    }
  };

  const switchFramework = (fw: Framework) => {
    setFramework(fw);
    setActiveIndex(0);
    setCopied(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
      {/* Framework toggle + tab bar */}
      <div className="flex flex-wrap items-center bg-[#181825] border-b border-slate-700/50">
        {/* React / Angular toggle */}
        <div className="flex items-center bg-slate-900/60 rounded-md m-1.5 sm:m-2 p-0.5 border border-slate-700/40 shrink-0">
          {(['react', 'angular'] as Framework[]).map((fw) => (
            <button
              key={fw}
              onClick={() => switchFramework(fw)}
              className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                framework === fw
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {fw === 'react' ? 'React' : 'Angular'}
            </button>
          ))}
        </div>

        {/* Snippet tabs */}
        <div className="flex items-center overflow-x-auto custom-scrollbar flex-1 min-w-0">
          {snippets.map((snippet, idx) => (
            <button
              key={snippet.label}
              onClick={() => {
                setActiveIndex(idx);
                setCopied(false);
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeIndex === idx
                  ? 'text-blue-400 border-blue-400 bg-[#1e1e2e]'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {ICON_MAP[snippet.icon]}
              <span>{snippet.label}</span>
            </button>
          ))}
        </div>

        {/* Copy button */}
        <div className="ml-auto pr-2 sm:pr-3 shrink-0 m-1.5 sm:m-0">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filename bar */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1e1e2e] border-b border-slate-700/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-slate-400 text-xs font-mono ml-2 truncate">{current.filename}</span>
        <span className="ml-auto text-xs text-slate-500 hidden sm:inline shrink-0">
          {framework === 'react' ? 'React + TypeScript' : 'Angular + TypeScript'}
        </span>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <pre className="p-3 sm:p-4 text-xs sm:text-sm leading-relaxed font-mono text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePanel;
