import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Share, X, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={compact
          ? "inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition"
          : "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-700 active:scale-95 transition"
        }
        title="Install Comfort Medi+ to home screen"
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={compact
            ? "inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-500/20 transition"
            : "inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition"
          }
        >
          <Smartphone className="w-4 h-4 text-teal-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div 
            onClick={() => setShowIOSGuide(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    CM+
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Install Comfort Medi+</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="text-xs text-slate-500 font-medium">To use offline and save to your iPhone/iPad home screen:</p>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <div className="text-xs">
                    Tap the <strong className="text-slate-900 flex items-center gap-1 inline-flex"><Share className="w-3.5 h-3.5 inline text-blue-600" /> Share</strong> icon in your Safari bottom bar.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <div className="text-xs">
                    Scroll down and tap <strong className="text-slate-900">"Add to Home Screen"</strong>.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <div className="text-xs">
                    Tap <strong className="text-slate-900">"Add"</strong> in the top right corner. The app will launch instantly without browser borders.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
