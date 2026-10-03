export type ThemeKey = 'ocean' | 'emerald' | 'sunset' | 'midnight';

export interface Theme {
  key: ThemeKey;
  name: string;
  description: string;
  /** Header gradient classes */
  headerGradient: string;
  /** Primary button bg + hover */
  primaryBtn: string;
  primaryBtnHover: string;
  /** Secondary/retake button */
  secondaryBtn: string;
  secondaryBtnHover: string;
  /** Submit button */
  submitBtn: string;
  submitBtnHover: string;
  /** Progress dot active color */
  dotActive: string;
  dotInactive: string;
  /** Info banner */
  bannerBg: string;
  bannerBorder: string;
  bannerText: string;
  /** Success icon circle */
  successBg: string;
  successIcon: string;
  /** Step indicator accent */
  stepIcon: string;
  /** Accent color used in labels */
  accentText: string;
  accentHover: string;
  /** Page background for the capture card container */
  cardBg: string;
  /** Outer wrapper bg in App */
  pageBg: string;
  pageHeaderBg: string;
  pageBorder: string;
  /** Section label colors */
  labelActive: string;
  labelMuted: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  ocean: {
    key: 'ocean',
    name: 'Ocean',
    description: 'Cool blue professional',
    headerGradient: 'from-blue-600 to-blue-700',
    primaryBtn: 'bg-blue-600',
    primaryBtnHover: 'hover:bg-blue-700',
    secondaryBtn: 'bg-gray-500',
    secondaryBtnHover: 'hover:bg-gray-600',
    submitBtn: 'bg-green-600',
    submitBtnHover: 'hover:bg-green-700',
    dotActive: 'bg-white',
    dotInactive: 'bg-blue-400',
    bannerBg: 'bg-blue-50',
    bannerBorder: 'border-blue-200',
    bannerText: 'text-blue-800',
    successBg: 'bg-green-100',
    successIcon: 'text-green-600',
    stepIcon: 'text-blue-400',
    accentText: 'text-blue-600',
    accentHover: 'hover:text-blue-700',
    cardBg: 'bg-slate-900',
    pageBg: 'bg-slate-950',
    pageHeaderBg: 'bg-slate-950/90',
    pageBorder: 'border-slate-800',
    labelActive: 'text-white',
    labelMuted: 'text-slate-400',
  },
  emerald: {
    key: 'emerald',
    name: 'Emerald',
    description: 'Fresh green natural',
    headerGradient: 'from-emerald-600 to-teal-700',
    primaryBtn: 'bg-emerald-600',
    primaryBtnHover: 'hover:bg-emerald-700',
    secondaryBtn: 'bg-gray-500',
    secondaryBtnHover: 'hover:bg-gray-600',
    submitBtn: 'bg-teal-600',
    submitBtnHover: 'hover:bg-teal-700',
    dotActive: 'bg-white',
    dotInactive: 'bg-emerald-400',
    bannerBg: 'bg-emerald-50',
    bannerBorder: 'border-emerald-200',
    bannerText: 'text-emerald-800',
    successBg: 'bg-teal-100',
    successIcon: 'text-teal-600',
    stepIcon: 'text-emerald-400',
    accentText: 'text-emerald-600',
    accentHover: 'hover:text-emerald-700',
    cardBg: 'bg-slate-900',
    pageBg: 'bg-slate-950',
    pageHeaderBg: 'bg-slate-950/90',
    pageBorder: 'border-slate-800',
    labelActive: 'text-white',
    labelMuted: 'text-slate-400',
  },
  sunset: {
    key: 'sunset',
    name: 'Sunset',
    description: 'Warm orange coral',
    headerGradient: 'from-orange-500 to-rose-600',
    primaryBtn: 'bg-orange-500',
    primaryBtnHover: 'hover:bg-orange-600',
    secondaryBtn: 'bg-gray-500',
    secondaryBtnHover: 'hover:bg-gray-600',
    submitBtn: 'bg-rose-600',
    submitBtnHover: 'hover:bg-rose-700',
    dotActive: 'bg-white',
    dotInactive: 'bg-orange-300',
    bannerBg: 'bg-orange-50',
    bannerBorder: 'border-orange-200',
    bannerText: 'text-orange-800',
    successBg: 'bg-rose-100',
    successIcon: 'text-rose-600',
    stepIcon: 'text-orange-400',
    accentText: 'text-orange-600',
    accentHover: 'hover:text-orange-700',
    cardBg: 'bg-slate-900',
    pageBg: 'bg-slate-950',
    pageHeaderBg: 'bg-slate-950/90',
    pageBorder: 'border-slate-800',
    labelActive: 'text-white',
    labelMuted: 'text-slate-400',
  },
  midnight: {
    key: 'midnight',
    name: 'Midnight',
    description: 'Dark slate cyan',
    headerGradient: 'from-slate-700 to-slate-900',
    primaryBtn: 'bg-cyan-600',
    primaryBtnHover: 'hover:bg-cyan-700',
    secondaryBtn: 'bg-slate-600',
    secondaryBtnHover: 'hover:bg-slate-700',
    submitBtn: 'bg-cyan-600',
    submitBtnHover: 'hover:bg-cyan-700',
    dotActive: 'bg-cyan-400',
    dotInactive: 'bg-slate-600',
    bannerBg: 'bg-slate-800',
    bannerBorder: 'border-slate-600',
    bannerText: 'text-cyan-300',
    successBg: 'bg-cyan-900',
    successIcon: 'text-cyan-400',
    stepIcon: 'text-cyan-400',
    accentText: 'text-cyan-400',
    accentHover: 'hover:text-cyan-300',
    cardBg: 'bg-slate-900',
    pageBg: 'bg-slate-950',
    pageHeaderBg: 'bg-slate-950/90',
    pageBorder: 'border-slate-800',
    labelActive: 'text-white',
    labelMuted: 'text-slate-400',
  },
};

export const THEME_LIST = Object.values(THEMES);
