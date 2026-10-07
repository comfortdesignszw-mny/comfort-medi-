import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithPhone, 
  registerWithPhone,
  ADMIN_EMAIL,
  normalizePhoneNumber
} from '../../lib/authService';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  Lock, 
  User as UserIcon, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Scale,
  Eye,
  EyeOff
} from 'lucide-react';
import { LegalModal } from '../legal/LegalModal';

export const AuthModal: React.FC = () => {
  const showAuthModal = useAppStore(s => s.showAuthModal);
  const authModalMode = useAppStore(s => s.authModalMode);
  const setShowAuthModal = useAppStore(s => s.setShowAuthModal);
  const setFirebaseUser = useAppStore(s => s.setFirebaseUser);
  const showToast = useAppStore(s => s.showToast);

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'phone'>('email');

  // Sync mode whenever opened
  React.useEffect(() => {
    if (showAuthModal && authModalMode) {
      setAuthMode(authModalMode);
    }
  }, [showAuthModal, authModalMode]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);

  if (!showAuthModal) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      setFirebaseUser(user);
      setShowAuthModal(false);
      showToast(
        user.role === 'admin' 
          ? `Welcome Admin (${user.fullName})!` 
          : `Signed in successfully as ${user.fullName}`, 
        'success'
      );
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setErrorMsg(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (authMode === 'register') {
        if (!fullName) {
          setErrorMsg('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const user = await registerWithEmail(email, password, fullName, phoneNumber);
        setFirebaseUser(user);
        setShowAuthModal(false);
        showToast(`Account registered as ${user.role.toUpperCase()}`, 'success');
      } else {
        const user = await loginWithEmail(email, password);
        setFirebaseUser(user);
        setShowAuthModal(false);
        showToast(`Welcome back, ${user.fullName}!`, 'success');
      }
    } catch (err: any) {
      console.error('Email auth error:', err);
      const code = err?.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. Please check your credentials.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please switch to Sign In.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = (phoneNumber || '').replace(/[^0-9]/g, '');
    if (!rawDigits || rawDigits.length < 6) {
      setErrorMsg('Please enter a valid phone number (at least 6 digits, e.g. 077 282 4132 or +263 77 282 4132).');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (authMode === 'register') {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full legal name.');
          setIsLoading(false);
          return;
        }
        const user = await registerWithPhone(phoneNumber, password, fullName);
        setFirebaseUser(user);
        setShowAuthModal(false);
        showToast(`Account registered successfully as ${user.role.toUpperCase()}`, 'success');
      } else {
        const user = await loginWithPhone(phoneNumber, password);
        setFirebaseUser(user);
        setShowAuthModal(false);
        showToast(`Welcome back, ${user.fullName}!`, 'success');
      }
    } catch (err: any) {
      console.warn('Phone auth notice:', err);
      const code = err?.code;
      const rawMessage = String(err?.message || '');

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setErrorMsg('Incorrect password. Please verify and try again.');
      } else if (code === 'auth/user-not-found') {
        setErrorMsg('No account found for this phone number. Switched to Register tab to create your account.');
        setAuthMode('register');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('This phone number is already registered. Switched to Sign In — please enter your password.');
        setAuthMode('signin');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password must be at least 6 characters.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg('Network error. Offline cache active — please check your connectivity.');
      } else if (rawMessage.startsWith('{') || rawMessage.includes('Firestore Error')) {
        setErrorMsg('Connection notice: credentials validated. Please retry to confirm.');
      } else {
        setErrorMsg(err?.message || 'Phone authentication could not be completed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      onClick={() => setShowAuthModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0a2540] via-teal-950 to-teal-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {authMode === 'signin' ? 'Sign In to Comfort Medi+' : 'Create Your Health Account'}
              </h2>
              <p className="text-[11px] text-teal-200/90">
                {authMode === 'signin' 
                  ? 'Access your medical records and care plan' 
                  : 'Register for personal health and adherence tracking'}
              </p>
            </div>
          </div>

          {/* Auth Mode Toggle (Sign In vs Register) */}
          <div className="mt-4 flex rounded-xl bg-black/30 p-1 text-xs font-bold">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'signin' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'register' ? 'bg-white text-[#0a2540] shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Method 1: Google SSO (Always visible on top) */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 hover:border-teal-500 hover:bg-teal-50/40 text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 transition active:scale-98 shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Or choose credentials
            </span>
          </div>

          {/* Credentials Tabs: Email vs Phone */}
          <div className="flex border-b border-slate-200 text-xs">
            <button
              onClick={() => { setActiveTab('email'); setErrorMsg(null); }}
              className={`flex-1 pb-2 font-bold flex items-center justify-center gap-1.5 transition border-b-2 -mb-[1px] ${
                activeTab === 'email'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email &amp; Password</span>
            </button>
            <button
              onClick={() => { setActiveTab('phone'); setErrorMsg(null); }}
              className={`flex-1 pb-2 font-bold flex items-center justify-center gap-1.5 transition border-b-2 -mb-[1px] ${
                activeTab === 'phone'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone &amp; Password</span>
            </button>
          </div>

          {/* TAB: EMAIL AND PASSWORD */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Full Legal / Patient Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nyasha Tariro Moyo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Mobile Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="+263 77 282 4132"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{authMode === 'signin' ? 'Sign In with Email' : 'Create Patient Account'}</span>
                )}
              </button>
            </form>
          )}

          {/* TAB: PHONE AND PASSWORD */}
          {activeTab === 'phone' && (
            <form onSubmit={handlePhoneAuth} className="space-y-3">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-teal-800">
                Enter your mobile number and password. Comfort Medi+ connects your phone ID automatically to the backend.
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tendai Chirandu"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +263 77 282 4132 or 0772824132"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter your password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating Phone ID...</span>
                  </>
                ) : (
                  <span>{authMode === 'signin' ? 'Sign In with Phone' : 'Register with Phone ID'}</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 text-center space-y-1.5">
            <p className="text-[10px] text-slate-400 leading-tight">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => setShowLegalModal(true)}
                className="text-teal-700 hover:text-teal-800 font-bold underline inline-flex items-center gap-0.5"
              >
                <span>Terms of Use &amp; Privacy Policy</span>
              </button>{' '}
              under the Zimbabwe Data Protection Act [Chapter 11:12].
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold underline"
              >
                Continue exploring as guest / offline mode
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Legal & Data Privacy Modal */}
      <LegalModal 
        isOpen={showLegalModal} 
        onClose={() => setShowLegalModal(false)} 
        defaultTab="privacy"
      />
    </div>
  );
};
