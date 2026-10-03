import React from 'react';
import { Camera, Code2, Github, CreditCard } from 'lucide-react';
import IDCardCapture from './components/IDCardCapture';
import CodePanel from './components/CodePanel';

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-base leading-tight">
                ID Card Capture
              </h1>
              <p className="text-slate-400 text-xs hidden sm:block">
                Webcam-based ID verification component for React
              </p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main split layout */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
          {/* Left side: Live camera capture demo */}
          <section className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">
                Live Demo — Try It Out
              </h2>
              <span className="ml-auto text-xs text-slate-500">Camera required</span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto rounded-xl bg-slate-900 border border-slate-800">
              <IDCardCapture />
            </div>
          </section>

          {/* Right side: Code snippets */}
          <section className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">
                Code — Copy &amp; Paste Into Your Project
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <CodePanel />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
