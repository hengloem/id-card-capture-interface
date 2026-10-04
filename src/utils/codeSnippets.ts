import type { Theme } from './themes';

export interface CodeSnippet {
  label: string;
  filename: string;
  icon: string;
  code: (theme: Theme) => string;
}

export const REACT_SNIPPETS: CodeSnippet[] = [
  {
    label: 'Install',
    filename: 'Terminal',
    icon: 'package',
    code: () => `npm install react-webcam lucide-react

# or with yarn
yarn add react-webcam lucide-react

# or with pnpm
pnpm add react-webcam lucide-react`,
  },
  {
    label: 'Component',
    filename: 'IDCardCapture.tsx',
    icon: 'code',
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

  return <div>{/* Your capture UI here */}</div>;
};

export default IDCardCapture;`,
  },
  {
    label: 'Storage',
    filename: 'captureStorage.ts',
    icon: 'settings',
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
    label: 'Theme',
    filename: 'themes.ts',
    icon: 'palette',
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
    label: 'Frame',
    filename: 'CameraFrame.tsx',
    icon: 'code',
    code: (theme) => `import React from 'react';

export type FrameStyle = 'rounded' | 'card' | 'circle' | 'corners' | 'scanline';

export const FRAME_OPTIONS: { key: FrameStyle; name: string }[] = [
  { key: 'rounded', name: 'Rounded' },
  { key: 'card', name: 'ID Card' },
  { key: 'circle', name: 'Circle' },
  { key: 'corners', name: 'Corners' },
  { key: 'scanline', name: 'Scan Line' },
];

// Accent color for the active theme "${theme.name}":
// ${theme.key === 'ocean' ? '#2563eb' : theme.key === 'emerald' ? '#059669' : theme.key === 'sunset' ? '#f97316' : '#0891b2'}

interface CameraFrameProps {
  style: FrameStyle;
  step: 'front' | 'back' | 'owner';
  accentColor: string;
}

const CameraFrame: React.FC<CameraFrameProps> = ({ style, step, accentColor }) => {
  switch (style) {
    case 'rounded':
      return (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 border-4 border-dashed
                          border-white/70 rounded-2xl" />
        </div>
      );

    case 'card':
      return (
        <div className="absolute inset-0 pointer-events-none flex
                        items-center justify-center">
          <div className="relative border-2 border-white/80 rounded-xl"
               style={{ width: '70%',
                        aspectRatio: step === 'owner' ? '1' : '1.586' }}>
            <div className="absolute -top-1 -left-1 w-4 h-4
                            border-t-4 border-l-4 rounded-tl-md"
                 style={{ borderColor: accentColor }} />
            <div className="absolute -top-1 -right-1 w-4 h-4
                            border-t-4 border-r-4 rounded-tr-md"
                 style={{ borderColor: accentColor }} />
            <div className="absolute -bottom-1 -left-1 w-4 h-4
                            border-b-4 border-l-4 rounded-bl-md"
                 style={{ borderColor: accentColor }} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4
                            border-b-4 border-r-4 rounded-br-md"
                 style={{ borderColor: accentColor }} />
          </div>
        </div>
      );

    case 'circle':
      return (
        <div className="absolute inset-0 pointer-events-none flex
                        items-center justify-center">
          <div className="relative">
            <div className="rounded-full border-4 border-white/80"
                 style={{ width: step === 'owner' ? '60%' : '50%',
                          aspectRatio: '1',
                          maxWidth: '320px', minWidth: '180px' }} />
            <div className="absolute top-1/2 -left-3 w-5 h-0.5 bg-white/60" />
            <div className="absolute top-1/2 -right-3 w-5 h-0.5 bg-white/60" />
            <div className="absolute left-1/2 -top-3 h-5 w-0.5 bg-white/60" />
            <div className="absolute left-1/2 -bottom-3 h-5 w-0.5 bg-white/60" />
          </div>
        </div>
      );

    case 'corners':
      return (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-6">
            <div className="absolute top-0 left-0 w-10 h-10
                            border-t-4 border-l-4 rounded-tl-lg"
                 style={{ borderColor: accentColor }} />
            <div className="absolute top-0 right-0 w-10 h-10
                            border-t-4 border-r-4 rounded-tr-lg"
                 style={{ borderColor: accentColor }} />
            <div className="absolute bottom-0 left-0 w-10 h-10
                            border-b-4 border-l-4 rounded-bl-lg"
                 style={{ borderColor: accentColor }} />
            <div className="absolute bottom-0 right-0 w-10 h-10
                            border-b-4 border-r-4 rounded-br-lg"
                 style={{ borderColor: accentColor }} />
          </div>
        </div>
      );

    case 'scanline':
      return (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-6 border-2 border-white/50
                          rounded-xl overflow-hidden">
            <div className="absolute left-0 right-0 h-1 animate-scanline"
                 style={{
                   background: \`linear-gradient(to right, transparent, \${accentColor}, transparent)\`,
                   boxShadow: \`0 0 12px \${accentColor}\`,
                 }} />
            <div className="absolute top-0 left-0 w-8 h-8
                            border-t-[3px] border-l-[3px] border-white/80
                            rounded-tl-md" />
            <div className="absolute top-0 right-0 w-8 h-8
                            border-t-[3px] border-r-[3px] border-white/80
                            rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-8 h-8
                            border-b-[3px] border-l-[3px] border-white/80
                            rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-8 h-8
                            border-b-[3px] border-r-[3px] border-white/80
                            rounded-br-md" />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default CameraFrame;

// CSS for scanline animation (add to index.css):
// @keyframes scanline {
//   0% { top: 0%; }
//   50% { top: calc(100% - 4px); }
//   100% { top: 0%; }
// }
// .animate-scanline {
//   animation: scanline 2.5s ease-in-out infinite;
// }`,
  },
  {
    label: 'Usage',
    filename: 'App.tsx',
    icon: 'code',
    code: () => `import { useState } from 'react';
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

export const ANGULAR_SNIPPETS: CodeSnippet[] = [
  {
    label: 'Install',
    filename: 'Terminal',
    icon: 'package',
    code: () => `# Install Angular CLI (if not already)
npm install -g @angular/cli

# Create a new project (skip if you have one)
ng new id-card-capture --routing=false --style=css

# Install dependencies
npm install ngx-webcam lucide-angular

# Nx workspace alternative
npm install ngx-webcam lucide-angular`,
  },
  {
    label: 'Component',
    filename: 'id-card-capture.component.ts',
    icon: 'code',
    code: () => `import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WebcamImage,
  WebcamInitError,
  WebcamUtil,
  WebcamModule,
} from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { CaptureStorageService } from '../services/capture-storage.service';
import { ThemeService } from '../services/theme.service';

type CaptureStep = 'front' | 'back' | 'owner' | 'review' | 'complete';

interface CapturedImages {
  front: string | null;
  back: string | null;
  owner: string | null;
}

@Component({
  selector: 'app-id-card-capture',
  standalone: true,
  imports: [CommonModule, WebcamModule],
  template: \`
    <div class="max-w-4xl mx-auto p-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">

        <!-- Header -->
        <div
          class="p-6"
          [ngClass]="theme().headerGradient"
          [style.background]="'linear-gradient(to right, var(--theme-from), var(--theme-to))'"
        >
          <h2 class="text-2xl font-bold text-white">{{ stepTitle() }}</h2>
          <p class="text-white/80">{{ stepInstructions() }}</p>
        </div>

        <!-- Camera / Preview / Review / Complete -->
        <div class="p-6">
          @switch (currentStep()) {
            @case ('complete') {
              <div class="text-center p-8">
                <div class="inline-block rounded-full p-6 mb-6"
                     [ngClass]="theme().successBg">
                  <span [ngClass]="theme().successIcon">✓</span>
                </div>
                <h3 class="text-2xl font-bold mb-2">Verification Submitted</h3>
                <button (click)="startOver()"
                        [ngClass]="theme().primaryBtn"
                        class="text-white px-8 py-3 rounded-lg">
                  Submit Another
                </button>
              </div>
            }
            @default {
              <!-- Webcam + capture button + review here -->
              <webcam [videoOptions]="videoConstraints"
                      (imageCapture)="handleImage($event)">
              </webcam>
              <button (click)="capture()"
                      [ngClass]="theme().primaryBtn"
                      class="text-white px-8 py-4 rounded-lg">
                Capture Photo
              </button>
            }
          }
        </div>
      </div>
    </div>
  \`,
})
export class IdCardCaptureComponent {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  private trigger$ = new Subject<void>();

  currentStep = signal<CaptureStep>('front');
  capturedImages = signal<CapturedImages>({
    front: null,
    back: null,
    owner: null,
  });
  isUploading = signal(false);
  captureId = signal<string | null>(null);

  theme = computed(() => this.themeService.currentTheme());

  trigger$: Observable<void> = this.trigger$.asObservable();

  videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment',
  };

  constructor(
    private storage: CaptureStorageService,
    private themeService: ThemeService,
  ) {}

  capture(): void {
    this.trigger$.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    const step = this.currentStep();
    if (step === 'front' || step === 'back' || step === 'owner') {
      this.capturedImages.update((prev) => ({
        ...prev,
        [step]: webcamImage.imageAsDataUrl,
      }));
    }
  }

  retake(): void {
    const step = this.currentStep() as keyof CapturedImages;
    this.capturedImages.update((prev) => ({ ...prev, [step]: null }));
  }

  nextStep(): void {
    const step = this.currentStep();
    if (step === 'front') this.currentStep.set('back');
    else if (step === 'back') this.currentStep.set('owner');
    else if (step === 'owner') this.currentStep.set('review');
  }

  previousStep(): void {
    const step = this.currentStep();
    if (step === 'back') this.currentStep.set('front');
    else if (step === 'owner') this.currentStep.set('back');
    else if (step === 'review') this.currentStep.set('owner');
  }

  handleSubmit(): void {
    const imgs = this.capturedImages();
    if (!imgs.front || !imgs.back || !imgs.owner) return;
    this.isUploading.set(true);
    try {
      const id = this.storage.saveCapture(imgs.front, imgs.back, imgs.owner);
      this.captureId.set(id);
      this.currentStep.set('complete');
    } catch (e) {
      console.error('Error submitting capture:', e);
    } finally {
      this.isUploading.set(false);
    }
  }

  startOver(): void {
    this.capturedImages.set({ front: null, back: null, owner: null });
    this.currentStep.set('front');
    this.captureId.set(null);
  }

  stepTitle(): string {
    switch (this.currentStep()) {
      case 'front': return 'Capture Front of ID Card';
      case 'back': return 'Capture Back of ID Card';
      case 'owner': return 'Capture Photo with ID Owner';
      case 'review': return 'Review Your Captures';
      case 'complete': return 'Submission Complete';
      default: return '';
    }
  }

  stepInstructions(): string {
    switch (this.currentStep()) {
      case 'front': return 'Position the front of the ID card within the frame.';
      case 'back': return 'Position the back of the ID card within the frame.';
      case 'owner': return 'Take a selfie while holding the ID card.';
      default: return '';
    }
  }
}`,
  },
  {
    label: 'Storage',
    filename: 'capture-storage.service.ts',
    icon: 'settings',
    code: () => `import { Injectable } from '@angular/core';

export interface StoredCapture {
  id: string;
  front_image: string;
  back_image: string;
  owner_image: string;
  captured_at: string;
}

const STORAGE_KEY = 'id_card_captures';

@Injectable({ providedIn: 'root' })
export class CaptureStorageService {
  saveCapture(front: string, back: string, owner: string): string {
    const id = this.generateId();
    const capture: StoredCapture = {
      id,
      front_image: front,
      back_image: back,
      owner_image: owner,
      captured_at: new Date().toISOString(),
    };

    const existing = this.getCaptures();
    const updated = [capture, ...existing];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return id;
    } catch (error) {
      console.error('Failed to save capture:', error);
      throw error;
    }
  }

  getCaptures(): StoredCapture[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredCapture[]) : [];
    } catch {
      return [];
    }
  }

  deleteCapture(id: string): void {
    const existing = this.getCaptures().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  clearAllCaptures(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private generateId(): string {
    return \`\${Date.now()}-\${Math.random().toString(36).slice(2, 11)}\`;
  }
}`,
  },
  {
    label: 'Theme',
    filename: 'theme.service.ts',
    icon: 'palette',
    code: (theme) => `import { Injectable, signal, computed } from '@angular/core';

export type ThemeKey = 'ocean' | 'emerald' | 'sunset' | 'midnight';

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

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = signal<ThemeKey>('ocean');

  currentTheme = computed(() => THEMES[this.themeKey()]);

  setTheme(key: ThemeKey): void {
    this.themeKey.set(key);
  }
}

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
    label: 'Frame',
    filename: 'camera-frame.component.ts',
    icon: 'code',
    code: (theme) => `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FrameStyle = 'rounded' | 'card' | 'circle' | 'corners' | 'scanline';

// Accent color for the active theme "${theme.name}":
// ${theme.key === 'ocean' ? '#2563eb' : theme.key === 'emerald' ? '#059669' : theme.key === 'sunset' ? '#f97316' : '#0891b2'}

@Component({
  selector: 'app-camera-frame',
  standalone: true,
  imports: [CommonModule],
  template: \`
    @switch (style) {
      @case ('rounded') {
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-8 border-4 border-dashed
                      border-white/70 rounded-2xl"></div>
        </div>
      }
      @case ('card') {
        <div class="absolute inset-0 pointer-events-none flex
                    items-center justify-center">
          <div class="relative border-2 border-white/80 rounded-xl"
               [style.width.%]="70"
               [style.aspectRatio]="step === 'owner' ? '1' : '1.586'">
            <div class="absolute -top-1 -left-1 w-4 h-4
                        border-t-4 border-l-4 rounded-tl-md"
                 [style.borderColor]="accentColor"></div>
            <div class="absolute -top-1 -right-1 w-4 h-4
                        border-t-4 border-r-4 rounded-tr-md"
                 [style.borderColor]="accentColor"></div>
            <div class="absolute -bottom-1 -left-1 w-4 h-4
                        border-b-4 border-l-4 rounded-bl-md"
                 [style.borderColor]="accentColor"></div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4
                        border-b-4 border-r-4 rounded-br-md"
                 [style.borderColor]="accentColor"></div>
          </div>
        </div>
      }
      @case ('circle') {
        <div class="absolute inset-0 pointer-events-none flex
                    items-center justify-center">
          <div class="relative">
            <div class="rounded-full border-4 border-white/80"
                 [style.width.%]="step === 'owner' ? 60 : 50"
                 style.aspect-ratio: 1; max-width: 320px; min-width: 180px;">
            </div>
            <div class="absolute top-1/2 -left-3 w-5 h-0.5 bg-white/60"></div>
            <div class="absolute top-1/2 -right-3 w-5 h-0.5 bg-white/60"></div>
            <div class="absolute left-1/2 -top-3 h-5 w-0.5 bg-white/60"></div>
            <div class="absolute left-1/2 -bottom-3 h-5 w-0.5 bg-white/60"></div>
          </div>
        </div>
      }
      @case ('corners') {
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-6">
            <div class="absolute top-0 left-0 w-10 h-10
                        border-t-4 border-l-4 rounded-tl-lg"
                 [style.borderColor]="accentColor"></div>
            <div class="absolute top-0 right-0 w-10 h-10
                        border-t-4 border-r-4 rounded-tr-lg"
                 [style.borderColor]="accentColor"></div>
            <div class="absolute bottom-0 left-0 w-10 h-10
                        border-b-4 border-l-4 rounded-bl-lg"
                 [style.borderColor]="accentColor"></div>
            <div class="absolute bottom-0 right-0 w-10 h-10
                        border-b-4 border-r-4 rounded-br-lg"
                 [style.borderColor]="accentColor"></div>
          </div>
        </div>
      }
      @case ('scanline') {
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-6 border-2 border-white/50
                      rounded-xl overflow-hidden">
            <div class="absolute left-0 right-0 h-1 animate-scanline"
                 [style.background]="'linear-gradient(to right, transparent, ' + accentColor + ', transparent)'"
                 [style.boxShadow]="'0 0 12px ' + accentColor">
            </div>
            <div class="absolute top-0 left-0 w-8 h-8
                        border-t-[3px] border-l-[3px] border-white/80
                        rounded-tl-md"></div>
            <div class="absolute top-0 right-0 w-8 h-8
                        border-t-[3px] border-r-[3px] border-white/80
                        rounded-tr-md"></div>
            <div class="absolute bottom-0 left-0 w-8 h-8
                        border-b-[3px] border-l-[3px] border-white/80
                        rounded-bl-md"></div>
            <div class="absolute bottom-0 right-0 w-8 h-8
                        border-b-[3px] border-r-[3px] border-white/80
                        rounded-br-md"></div>
          </div>
        </div>
      }
    }
  \`,
})
export class CameraFrameComponent {
  @Input() style: FrameStyle = 'rounded';
  @Input() step: 'front' | 'back' | 'owner' = 'front';
  @Input() accentColor = '#2563eb';
}

// CSS for scanline animation (add to styles.css):
// @keyframes scanline {
//   0% { top: 0%; }
//   50% { top: calc(100% - 4px); }
//   100% { top: 0%; }
// }
// .animate-scanline {
//   animation: scanline 2.5s ease-in-out infinite;
// }`,
  },
  {
    label: 'Usage',
    filename: 'app.component.ts',
    icon: 'code',
    code: () => `import { Component, inject } from '@angular/core';
import { IdCardCaptureComponent } from './id-card-capture/id-card-capture.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IdCardCaptureComponent],
  template: \`
    <div class="min-h-screen bg-slate-950">
      <!-- Switch themes: 'ocean' | 'emerald' | 'sunset' | 'midnight' -->
      <app-id-card-capture />
    </div>
  \`,
})
export class AppComponent {
  // Theme is injected via the component's ThemeService
  // Change theme: themeService.setTheme('emerald');
}`,
  },
];
