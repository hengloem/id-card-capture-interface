import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, ArrowLeft, ArrowRight, Loader2, ScanLine } from 'lucide-react';
import { saveCapture } from '../utils/captureStorage';
import type { Theme } from '../utils/themes';
import CameraFrame, { FRAME_OPTIONS, type FrameStyle } from './CameraFrame';

const ACCENT_HEX: Record<string, string> = {
  ocean: '#2563eb',
  emerald: '#059669',
  sunset: '#f97316',
  midnight: '#0891b2',
};

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
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('rounded');

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: currentStep === 'owner' ? 'user' : 'environment'
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages(prev => ({
        ...prev,
        [currentStep]: imageSrc
      }));
    }
  }, [currentStep]);

  const retake = () => {
    setCapturedImages(prev => ({
      ...prev,
      [currentStep]: null
    }));
  };

  const nextStep = () => {
    if (currentStep === 'front') {
      setCurrentStep('back');
    } else if (currentStep === 'back') {
      setCurrentStep('owner');
    } else if (currentStep === 'owner') {
      setCurrentStep('review');
    }
  };

  const previousStep = () => {
    if (currentStep === 'back') {
      setCurrentStep('front');
    } else if (currentStep === 'owner') {
      setCurrentStep('back');
    } else if (currentStep === 'review') {
      setCurrentStep('owner');
    }
  };

  const handleSubmit = async () => {
    if (!capturedImages.front || !capturedImages.back || !capturedImages.owner) {
      return;
    }

    setIsUploading(true);

    try {
      const id = saveCapture(
        capturedImages.front,
        capturedImages.back,
        capturedImages.owner
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 'front':
        return 'Capture Front of ID Card';
      case 'back':
        return 'Capture Back of ID Card';
      case 'owner':
        return 'Capture Photo with ID Owner';
      case 'review':
        return 'Review Your Captures';
      case 'complete':
        return 'Submission Complete';
      default:
        return '';
    }
  };

  const getStepInstructions = () => {
    switch (currentStep) {
      case 'front':
        return 'Position the front of the ID card within the frame. Ensure all text is readable.';
      case 'back':
        return 'Position the back of the ID card within the frame. Ensure all details are visible.';
      case 'owner':
        return 'Take a selfie while holding the ID card next to your face.';
      default:
        return '';
    }
  };

  const currentImage = capturedImages[currentStep as keyof CapturedImages];

  if (currentStep === 'complete') {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className={`${theme.successBg} rounded-full p-4 sm:p-6`}>
                <Check className={`w-12 h-12 sm:w-16 sm:h-16 ${theme.successIcon}`} />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              ID Verification Submitted
            </h2>
            <p className="text-gray-600 mb-2">
              Your ID card verification has been successfully submitted.
            </p>
            {captureId && (
              <p className="text-sm text-gray-500 mb-6">
                Reference ID: {captureId}
              </p>
            )}
            <button
              onClick={startOver}
              className={`${theme.primaryBtn} text-white px-8 py-3 rounded-lg ${theme.primaryBtnHover} transition-colors font-medium`}
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{getStepTitle()}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-lg">Front of ID</h3>
                <img
                  src={capturedImages.front!}
                  alt="Front of ID"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => setCurrentStep('front')}
                  className={`w-full ${theme.accentText} ${theme.accentHover} text-sm font-medium`}
                >
                  Retake Front
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-lg">Back of ID</h3>
                <img
                  src={capturedImages.back!}
                  alt="Back of ID"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => setCurrentStep('back')}
                  className={`w-full ${theme.accentText} ${theme.accentHover} text-sm font-medium`}
                >
                  Retake Back
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-lg">Photo with Owner</h3>
                <img
                  src={capturedImages.owner!}
                  alt="ID Owner"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => setCurrentStep('owner')}
                  className={`w-full ${theme.accentText} ${theme.accentHover} text-sm font-medium`}
                >
                  Retake Photo
                </button>
              </div>
            </div>

            <div className={`${theme.bannerBg} border ${theme.bannerBorder} rounded-lg p-4 mb-6`}>
              <p className={`${theme.bannerText} text-sm`}>
                Please review all images carefully before submitting. Make sure all text is readable and the photo clearly shows the ID owner.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
              <button
                onClick={previousStep}
                className={`${theme.secondaryBtn} text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${theme.secondaryBtnHover} transition-colors font-medium`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className={`${theme.submitBtn} text-white px-8 py-3 rounded-lg flex items-center justify-center space-x-2 ${theme.submitBtnHover} transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Submit Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${theme.headerGradient} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{getStepTitle()}</h2>
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${currentStep === 'front' || capturedImages.front ? theme.dotActive : theme.dotInactive}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep === 'back' || capturedImages.back ? theme.dotActive : theme.dotInactive}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep === 'owner' || capturedImages.owner ? theme.dotActive : theme.dotInactive}`} />
            </div>
          </div>
          <p className="text-white/80 text-sm sm:text-base">{getStepInstructions()}</p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {!currentImage ? (
              <>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full rounded-lg"
                  />
                  <CameraFrame
                    style={frameStyle}
                    step={currentStep as 'front' | 'back' | 'owner'}
                    accentColor={ACCENT_HEX[theme.key] ?? '#2563eb'}
                  />
                </div>

                {/* Frame style selector */}
                <div className="flex items-center gap-2 flex-wrap">
                  <ScanLine className="w-4 h-4 text-gray-500 shrink-0" />
                  {FRAME_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setFrameStyle(opt.key)}
                      title={opt.description}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        frameStyle === opt.key
                          ? `${theme.primaryBtn} text-white shadow-sm`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={capture}
                    className={`${theme.primaryBtn} text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg flex items-center space-x-2 sm:space-x-3 ${theme.primaryBtnHover} transition-colors shadow-lg font-medium text-sm sm:text-base`}
                  >
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Capture Photo</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Tips:</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Ensure good lighting without glare</li>
                    <li>• Keep the {currentStep === 'owner' ? 'ID card visible and your face clear' : 'ID card flat and steady'}</li>
                    <li>• Make sure all text is readable</li>
                    <li>• Avoid shadows and reflections</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <img
                  src={currentImage}
                  alt={`Captured ${currentStep}`}
                  className="w-full rounded-lg shadow-md"
                />

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                  <button
                    onClick={retake}
                    className={`${theme.secondaryBtn} text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${theme.secondaryBtnHover} transition-colors font-medium`}
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Retake</span>
                  </button>

                  <button
                    onClick={nextStep}
                    className={`${theme.primaryBtn} text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${theme.primaryBtnHover} transition-colors font-medium`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {(currentStep !== 'front' && !currentImage) && (
              <button
                onClick={previousStep}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium"
              >
                ← Go back to previous step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardCapture;
