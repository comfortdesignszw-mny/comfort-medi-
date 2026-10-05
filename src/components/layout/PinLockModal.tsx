import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { triggerBiometricAuthentication } from '../../lib/security';
import { Lock, Fingerprint, Delete, ShieldCheck, AlertCircle } from 'lucide-react';

export const PinLockModal: React.FC = () => {
  const isPinLocked = useAppStore(s => s.isPinLocked);
  const unlockWithPin = useAppStore(s => s.unlockWithPin);
  const setPinLocked = useAppStore(s => s.setPinLocked);
  const showToast = useAppStore(s => s.showToast);

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isPinLocked) return null;

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setErrorMsg('');

      if (next.length === 4) {
        const success = unlockWithPin(next);
        if (!success) {
          setErrorMsg('Incorrect PIN. Default is 1234');
          setTimeout(() => {
            setEnteredPin('');
          }, 400);
        } else {
          showToast('Unlocked successfully', 'success');
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometrics = async () => {
    const passed = await triggerBiometricAuthentication();
    if (passed) {
      setPinLocked(false);
      showToast('Unlocked with Biometrics', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-xs rounded-3xl bg-white p-7 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">Comfort Medi+</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">Enter your 4-digit security PIN to access medical records (Default: 1234)</p>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled ? 'bg-teal-600 scale-110' : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mb-4 bg-rose-50 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-50 text-xl font-bold text-slate-800 hover:bg-slate-100 active:scale-95 active:bg-teal-50 active:text-teal-700 transition flex items-center justify-center border border-slate-100 shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBiometrics}
            className="h-14 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center border border-slate-100 shadow-sm"
            title="Biometric Fingerprint / Face ID"
          >
            <Fingerprint className="w-6 h-6 text-teal-600" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-50 text-xl font-bold text-slate-800 hover:bg-slate-100 active:scale-95 active:bg-teal-50 active:text-teal-700 transition flex items-center justify-center border border-slate-100 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center border border-slate-100 shadow-sm"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Local AES-256 Encrypted Vault</span>
        </div>
      </div>
    </div>
  );
};
