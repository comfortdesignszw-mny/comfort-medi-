import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const syncQueue = useAppStore(s => s.syncQueue);
  const isSyncing = useAppStore(s => s.isSyncing);
  const triggerManualSync = useAppStore(s => s.triggerManualSync);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-trigger sync when back online
      if (syncQueue.length > 0) {
        triggerManualSync();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue.length, triggerManualSync]);

  if (isOnline && syncQueue.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 text-white px-4 py-3 shadow-xl backdrop-blur-md border border-slate-700/60 max-w-md mx-auto sm:mx-0 animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2.5 min-w-0">
        {!isOnline ? (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
        <div className="truncate">
          <p className="text-xs font-bold leading-tight">
            {!isOnline ? 'Offline Mode Active' : 'Online'}
          </p>
          <p className="text-[11px] text-slate-300 truncate">
            {syncQueue.length > 0 
              ? `${syncQueue.length} record${syncQueue.length > 1 ? 's' : ''} queued locally`
              : 'All medical records saved locally'}
          </p>
        </div>
      </div>

      {syncQueue.length > 0 && (
        <button
          onClick={() => triggerManualSync()}
          disabled={isSyncing}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      )}
    </div>
  );
};
