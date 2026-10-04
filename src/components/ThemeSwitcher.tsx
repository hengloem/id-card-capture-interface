import React from 'react';
import { Palette, Check } from 'lucide-react';
import { THEME_LIST, type Theme, type ThemeKey } from '../utils/themes';

interface ThemeSwitcherProps {
  currentTheme: ThemeKey;
  onSelect: (key: ThemeKey) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onSelect }) => {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-800/60 rounded-lg p-1 border border-slate-700/50">
      <Palette className="w-4 h-4 text-slate-400 ml-1 sm:ml-1.5 mr-0.5 shrink-0" />
      {THEME_LIST.map((theme: Theme) => (
        <button
          key={theme.key}
          onClick={() => onSelect(theme.key)}
          title={theme.description}
          className={`relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentTheme === theme.key
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${theme.headerGradient}`} />
          <span className="hidden md:inline">{theme.name}</span>
          {currentTheme === theme.key && (
            <Check className="w-3 h-3 text-white" />
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
