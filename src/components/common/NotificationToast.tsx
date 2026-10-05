import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const activeToast = useAppStore(s => s.activeToast);
  const hideToast = useAppStore(s => s.hideToast);

  if (!activeToast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-teal-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    error: <XCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-50/95 text-emerald-950',
    info: 'border-teal-500/20 bg-teal-50/95 text-teal-950',
    warning: 'border-amber-500/20 bg-amber-50/95 text-amber-950',
    error: 'border-rose-500/20 bg-rose-50/95 text-rose-950',
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md ${borders[activeToast.type]}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {icons[activeToast.type]}
          <p className="text-xs font-semibold leading-snug">{activeToast.message}</p>
        </div>
        <button
          onClick={hideToast}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-black/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
