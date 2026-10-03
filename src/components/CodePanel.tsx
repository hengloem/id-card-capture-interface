import React, { useState } from 'react';
import { Copy, Check, Code2, Package, Settings, Palette } from 'lucide-react';
import type { Theme } from '../utils/themes';

type TabKey = 'install' | 'component' | 'storage' | 'theme' | 'usage';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  filename: string;
  code: (theme: Theme) => string;
}

const TABS: Tab[] = [
  {
    key: 'install',
    label: 'Install',
    icon: <Package className="w-4 h-4" />,
    filename: 'Terminal',
    code: () => `npm install react-webcam lucide-react

# or with yarn
yarn add react-webcam lucide-react

# or with pnpm
pnpm add react-webcam lucide-react`,
  },
  {
    key: 'component',
    label: 'Component',
    icon: <Code2 className="w-4 h-4" />,
    filename: 'IDCardCapture.tsx',
    code: () => `import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { saveCapture } from '../utils/captureStorage';
import type { Theme } from '../utils/themes';

type CaptureStep = 'front' | 'back' | 'owner' | 'review' | 'complete';

interface CapturedImages {
  front: string | null;
  back: string | null;
  owner: string | null;
}

interface IDCardCaptureProps {
  theme: Theme;
}

const IDCardCapture: React.FC<IDCardCaptureProps> = ({ theme }) => {
  const webcamRef = useRef<Webcam>(null);
  const [currentStep, setCurrentStep] = useState<CaptureStep>('front');
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({
    front: null,
    back: null,
    owner: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [captureId, setCaptureId] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: currentStep === 'owner' ? 'user' : 'environment',
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => ({ ...prev, [currentStep]: imageSrc }));
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    if (!capturedImages.front || !capturedImages.back || !capturedImages.owner) return;
    setIsUploading(true);
    try {
      const id = saveCapture(
        capturedImages.front,
        capturedImages.back,
        capturedImages.owner,
      );
      setCaptureId(id);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error submitting capture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Pass the theme object as a prop — all colors come from it.
  // Switch themes by passing a different Theme to the component.

  return <div>{/* Your capture UI here */}</div>;
};

export default IDCardCapture;`,
  },
  {
    key: 'storage',
    label: 'Storage',
    icon: <Settings className="w-4 h-4" />,
    filename: 'captureStorage.ts',
    code: () => `const STORAGE_KEY = 'id_card_captures';

export interface StoredCapture {
  id: string;
  front_image: string;
  back_image: string;
  owner_image: string;
  captured_at: string;
}

export function saveCapture(
  frontImage: string,
  backImage: string,
  ownerImage: string,
): string {
  const id = generateId();
  const capture: StoredCapture = {
    id,
    front_image: frontImage,
    back_image: backImage,
    owner_image: ownerImage,
    captured_at: new Date().toISOString(),
  };

  const existing = getCaptures();
  const updated = [capture, ...existing];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return id;
  } catch (error) {
    console.error('Failed to save capture to localStorage:', error);
    throw error;
  }
}

export function getCaptures(): StoredCapture[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCapture[]) : [];
  } catch {
    return [];
  }
}

export function deleteCapture(id: string): void {
  const existing = getCaptures().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function clearAllCaptures(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function generateId(): string {
  return \`\${Date.now()}-\${Math.random().toString(36).slice(2, 11)}\`;
}`,
  },
  {
    key: 'theme',
    label: 'Theme',
    icon: <Palette className="w-4 h-4" />,
    filename: 'themes.ts',
    code: (theme) => `export type ThemeKey = 'ocean' | 'emerald' | 'sunset' | 'midnight';

export interface Theme {
  key: ThemeKey;
  name: string;
  headerGradient: string;
  primaryBtn: string;
  primaryBtnHover: string;
  secondaryBtn: string;
  secondaryBtnHover: string;
  submitBtn: string;
  submitBtnHover: string;
  dotActive: string;
  dotInactive: string;
  bannerBg: string;
  bannerBorder: string;
  bannerText: string;
  successBg: string;
  successIcon: string;
  accentText: string;
  accentHover: string;
}

// Currently selected: "${theme.name}" (${theme.key})
// Switch themes in the header to see this change.

export const THEMES: Record<ThemeKey, Theme> = {
  ocean: {
    key: 'ocean', name: 'Ocean',
    headerGradient: 'from-blue-600 to-blue-700',
    primaryBtn: 'bg-blue-600', primaryBtnHover: 'hover:bg-blue-700',
    secondaryBtn: 'bg-gray-500', secondaryBtnHover: 'hover:bg-gray-600',
    submitBtn: 'bg-green-600', submitBtnHover: 'hover:bg-green-700',
    dotActive: 'bg-white', dotInactive: 'bg-blue-400',
    bannerBg: 'bg-blue-50', bannerBorder: 'border-blue-200', bannerText: 'text-blue-800',
    successBg: 'bg-green-100', successIcon: 'text-green-600',
    accentText: 'text-blue-600', accentHover: 'hover:text-blue-700',
  },
  emerald: {
    key: 'emerald', name: 'Emerald',
    headerGradient: 'from-emerald-600 to-teal-700',
    primaryBtn: 'bg-emerald-600', primaryBtnHover: 'hover:bg-emerald-700',
    secondaryBtn: 'bg-gray-500', secondaryBtnHover: 'hover:bg-gray-600',
    submitBtn: 'bg-teal-600', submitBtnHover: 'hover:bg-teal-700',
    dotActive: 'bg-white', dotInactive: 'bg-emerald-400',
    bannerBg: 'bg-emerald-50', bannerBorder: 'border-emerald-200', bannerText: 'text-emerald-800',
    successBg: 'bg-teal-100', successIcon: 'text-teal-600',
    accentText: 'text-emerald-600', accentHover: 'hover:text-emerald-700',
  },
  sunset: {
    key: 'sunset', name: 'Sunset',
    headerGradient: 'from-orange-500 to-rose-600',
    primaryBtn: 'bg-orange-500', primaryBtnHover: 'hover:bg-orange-600',
    secondaryBtn: 'bg-gray-500', secondaryBtnHover: 'hover:bg-gray-600',
    submitBtn: 'bg-rose-600', submitBtnHover: 'hover:bg-rose-700',
    dotActive: 'bg-white', dotInactive: 'bg-orange-300',
    bannerBg: 'bg-orange-50', bannerBorder: 'border-orange-200', bannerText: 'text-orange-800',
    successBg: 'bg-rose-100', successIcon: 'text-rose-600',
    accentText: 'text-orange-600', accentHover: 'hover:text-orange-700',
  },
  midnight: {
    key: 'midnight', name: 'Midnight',
    headerGradient: 'from-slate-700 to-slate-900',
    primaryBtn: 'bg-cyan-600', primaryBtnHover: 'hover:bg-cyan-700',
    secondaryBtn: 'bg-slate-600', secondaryBtnHover: 'hover:bg-slate-700',
    submitBtn: 'bg-cyan-600', submitBtnHover: 'hover:bg-cyan-700',
    dotActive: 'bg-cyan-400', dotInactive: 'bg-slate-600',
    bannerBg: 'bg-slate-800', bannerBorder: 'border-slate-600', bannerText: 'text-cyan-300',
    successBg: 'bg-cyan-900', successIcon: 'text-cyan-400',
    accentText: 'text-cyan-400', accentHover: 'hover:text-cyan-300',
  },
};`,
  },
  {
    key: 'usage',
    label: 'Usage',
    icon: <Code2 className="w-4 h-4" />,
    filename: 'App.tsx',
    code: (theme) => `import { useState } from 'react';
import IDCardCapture from './components/IDCardCapture';
import { THEMES, type ThemeKey } from './utils/themes';

function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('ocean');
  const theme = THEMES[themeKey];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Switch themes: 'ocean' | 'emerald' | 'sunset' | 'midnight' */}
      <IDCardCapture theme={theme} />
    </div>
  );
}

export default App;`,
  },
];

interface CodePanelProps {
  theme: Theme;
}

const CodePanel: React.FC<CodePanelProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('install');
  const [copied, setCopied] = useState(false);

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const code = currentTab.code(theme);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may not be available
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
      {/* Tab bar */}
      <div className="flex items-center bg-[#181825] border-b border-slate-700/50 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCopied(false);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'text-blue-400 border-blue-400 bg-[#1e1e2e]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}

        <div className="ml-auto pr-3">
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
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] border-b border-slate-700/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-slate-400 text-xs font-mono ml-2">{currentTab.filename}</span>
        {activeTab === 'theme' && (
          <span className="ml-auto text-xs text-slate-500">
            Active: <span className="text-blue-400">{theme.name}</span>
          </span>
        )}
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <pre className="p-4 text-sm leading-relaxed font-mono text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePanel;
