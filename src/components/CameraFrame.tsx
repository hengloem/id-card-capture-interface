import React from 'react';

export type FrameStyle = 'rounded' | 'card' | 'circle' | 'corners' | 'scanline';

export interface FrameOption {
  key: FrameStyle;
  name: string;
  description: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  { key: 'rounded', name: 'Rounded', description: 'Simple dashed rounded rectangle' },
  { key: 'card', name: 'ID Card', description: 'Card-shaped outline (3:2 ratio)' },
  { key: 'circle', name: 'Circle', description: 'Circular face guide' },
  { key: 'corners', name: 'Corners', description: 'L-shaped corner brackets' },
  { key: 'scanline', name: 'Scan Line', description: 'Animated scanning line' },
];

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
          <div className="absolute inset-8 border-4 border-dashed border-white/70 rounded-2xl" />
        </div>
      );

    case 'card':
      return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="relative border-2 border-white/80 rounded-xl"
            style={{ width: '70%', aspectRatio: step === 'owner' ? '1' : '1.586' }}
          >
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 rounded-tl-md" style={{ borderColor: accentColor }} />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 rounded-tr-md" style={{ borderColor: accentColor }} />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 rounded-bl-md" style={{ borderColor: accentColor }} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 rounded-br-md" style={{ borderColor: accentColor }} />
          </div>
        </div>
      );

    case 'circle':
      return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative">
            <div
              className="rounded-full border-4 border-white/80"
              style={{
                width: step === 'owner' ? '60%' : '50%',
                aspectRatio: '1',
                maxWidth: '320px',
                minWidth: '180px',
              }}
            />
            {/* Guide ticks */}
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
            {/* Top-left */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: accentColor }} />
            {/* Top-right */}
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: accentColor }} />
            {/* Bottom-left */}
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: accentColor }} />
            {/* Bottom-right */}
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: accentColor }} />
          </div>
        </div>
      );

    case 'scanline':
      return (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-6 border-2 border-white/50 rounded-xl overflow-hidden">
            <div
              className="absolute left-0 right-0 h-1 animate-scanline"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
                boxShadow: `0 0 12px ${accentColor}`,
              }}
            />
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-white/80 rounded-tl-md" style={{ borderWidth: '3px' }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-white/80 rounded-tr-md" style={{ borderWidth: '3px' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-white/80 rounded-bl-md" style={{ borderWidth: '3px' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-white/80 rounded-br-md" style={{ borderWidth: '3px' }} />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default CameraFrame;
