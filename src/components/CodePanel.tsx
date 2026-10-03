import React, { useState } from 'react';
import { Copy, Check, Code2, Package, Settings } from 'lucide-react';

type TabKey = 'install' | 'component' | 'storage' | 'usage';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  filename: string;
  language: string;
  code: string;
}

const TABS: Tab[] = [
  {
    key: 'install',
    label: 'Install',
    icon: <Package className="w-4 h-4" />,
    filename: 'Terminal',
    language: 'bash',
    code: `npm install react-webcam lucide-react

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
    language: 'tsx',
    code: `import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { saveCapture } from '../utils/captureStorage';

type CaptureStep = 'front' | 'back' | 'owner' | 'review' | 'complete';

interface CapturedImages {
  front: string | null;
  back: string | null;
  owner: string | null;
}

const IDCardCapture: React.FC = () => {
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

  const retake = () => {
    setCapturedImages((prev) => ({ ...prev, [currentStep]: null }));
  };

  const nextStep = () => {
    if (currentStep === 'front') setCurrentStep('back');
    else if (currentStep === 'back') setCurrentStep('owner');
    else if (currentStep === 'owner') setCurrentStep('review');
  };

  const previousStep = () => {
    if (currentStep === 'back') setCurrentStep('front');
    else if (currentStep === 'owner') setCurrentStep('back');
    else if (currentStep === 'review') setCurrentStep('owner');
  };

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

  const startOver = () => {
    setCapturedImages({ front: null, back: null, owner: null });
    setCurrentStep('front');
    setCaptureId(null);
  };

  // ...renders the camera UI, review screen, and completion screen
  // Full UI code omitted here for brevity — see the live demo on the left.

  return <div>{/* Your capture UI here */}</div>;
};

export default IDCardCapture;`,
  },
  {
    key: 'storage',
    label: 'Storage',
    icon: <Settings className="w-4 h-4" />,
    filename: 'captureStorage.ts',
    language: 'typescript',
    code: `const STORAGE_KEY = 'id_card_captures';

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
    key: 'usage',
    label: 'Usage',
    icon: <Code2 className="w-4 h-4" />,
    filename: 'App.tsx',
    language: 'tsx',
    code: `import IDCardCapture from './components/IDCardCapture';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <IDCardCapture />
    </div>
  );
}

export default App;`,
  },
];

const CodePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('install');
  const [copied, setCopied] = useState(false);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentTab.code);
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
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <pre className="p-4 text-sm leading-relaxed font-mono text-slate-300">
          <code>{currentTab.code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePanel;
