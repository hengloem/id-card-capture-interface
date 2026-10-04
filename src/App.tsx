import React, { useState } from 'react';
import { Camera, Code2, Github, CreditCard } from 'lucide-react';
import IDCardCapture from './components/IDCardCapture';
import CodePanel from './components/CodePanel';
import ThemeSwitcher from './components/ThemeSwitcher';
import { THEMES, type ThemeKey } from './utils/themes';

function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('ocean');
  const theme = THEMES[themeKey];

  return (
    <div className={`min-h-screen ${theme.pageBg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${theme.pageBorder} ${theme.pageHeaderBg} backdrop-blur-md`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`bg-gradient-to-br ${theme.headerGradient} rounded-lg p-2 shadow-lg`}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`${theme.labelActive} font-bold text-sm sm:text-base leading-tight`}>
                ID Card Capture
              </h1>
              <p className={`${theme.labelMuted} text-xs hidden sm:block`}>
                Webcam-based ID verification component for React
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher currentTheme={themeKey} onSelect={setThemeKey} />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${theme.labelMuted} hover:text-white transition-colors shrink-0`}
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main split layout */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
          {/* Left side: Live camera capture demo */}
          <section className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Camera className={`w-5 h-5 ${theme.stepIcon}`} />
              <h2 className={`${theme.labelActive} font-semibold text-sm`}>
                Live Demo — Try It Out
              </h2>
              <span className={`ml-auto text-xs ${theme.labelMuted} opacity-60`}>Camera required</span>
            </div>
            <div className={`flex-1 min-h-0 overflow-auto custom-scrollbar rounded-xl ${theme.cardBg} border ${theme.pageBorder}`}>
              <IDCardCapture theme={theme} />
            </div>
          </section>

          {/* Right side: Code snippets */}
          <section className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className={`w-5 h-5 ${theme.stepIcon}`} />
              <h2 className={`${theme.labelActive} font-semibold text-sm`}>
                Code — Copy &amp; Paste Into Your Project
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <CodePanel theme={theme} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
