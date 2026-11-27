import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Code2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from 'lucide-react';
import CodeArenaLogo from './CodeArenaLogo';
import { signIn, signUp } from '../services/auth';

const fieldClassName =
  'w-full rounded-xl border border-white/10 bg-[#0D0E14] py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#C4A5F5]/70 focus:ring-2 focus:ring-[#C4A5F5]/15';

export default function InteractiveModal({
  modal,
  onClose,
  onSwitchMode,
  onAuthenticated,
}) {
  const [selectedLang, setSelectedLang] = useState('C++20');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isAuthMode = modal.mode === 'login' || modal.mode === 'signup';
  const isSignup = modal.mode === 'signup';

  useEffect(() => {
    setCompleted(false);
    setSubmitting(false);
    setError('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  }, [modal.mode, modal.isOpen]);

  useEffect(() => {
    if (!modal.isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modal.isOpen, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isAuthMode) {
      setCompleted(true);
      return;
    }

    setSubmitting(true);
    try {
      const token = isSignup
        ? await signUp({ firstName, lastName, email, password })
        : await signIn(email, password);
      await onAuthenticated?.(token);
      setCompleted(true);
    } catch (submitError) {
      setError(
        submitError.message === 'Failed to fetch'
          ? 'Unable to reach CodeArena. Make sure the backend is running and try again.'
          : submitError.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const title = isAuthMode
    ? isSignup
      ? 'Create your account'
      : 'Welcome back'
    : modal.title;
  const subtitle = isAuthMode
    ? isSignup
      ? 'Join CodeArena and keep your practice, progress, and contests in one place.'
      : 'Sign in to continue to your CodeArena dashboard.'
    : modal.subtitle;

  const switchMode = () => {
    setError('');
    onSwitchMode?.(isSignup ? 'login' : 'signup');
  };

  const textField = ({ id, label, icon: Icon, ...inputProps }) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input id={id} className={fieldClassName} {...inputProps} />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ca-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111218] shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="pointer-events-none absolute -top-32 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-[#7775EF]/15 blur-[90px]" />
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-5 top-5 rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-6 flex items-center gap-2.5">
                <CodeArenaLogo className="h-8 w-8" />
                <span className="text-sm font-semibold tracking-tight text-white">
                  Code<span className="text-[#C4A5F5]">Arena</span>
                </span>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C4A5F5]">
                  {isAuthMode ? (isSignup ? 'Get started' : 'Your workspace awaits') : 'CodeArena'}
                </p>
                <h2 id="ca-modal-title" className="text-2xl font-semibold tracking-tight text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
              </div>

              {!completed ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isAuthMode ? (
                    <>
                      {isSignup && (
                        <div className="grid grid-cols-2 gap-3">
                          {textField({
                            id: 'ca-first-name',
                            label: 'First name',
                            icon: UserRound,
                            type: 'text',
                            autoComplete: 'given-name',
                            required: true,
                            minLength: 2,
                            value: firstName,
                            onChange: (event) => setFirstName(event.target.value),
                            placeholder: 'Alex',
                          })}
                          {textField({
                            id: 'ca-last-name',
                            label: 'Last name',
                            icon: UserRound,
                            type: 'text',
                            autoComplete: 'family-name',
                            required: true,
                            minLength: 2,
                            value: lastName,
                            onChange: (event) => setLastName(event.target.value),
                            placeholder: 'Morgan',
                          })}
                        </div>
                      )}
                      {textField({
                        id: 'ca-email',
                        label: 'Email address',
                        icon: Mail,
                        type: 'email',
                        autoComplete: 'email',
                        required: true,
                        value: email,
                        onChange: (event) => setEmail(event.target.value),
                        placeholder: 'you@example.com',
                      })}
                      <div>
                        <label htmlFor="ca-password" className="mb-1.5 block text-xs font-medium text-zinc-300">
                          Password
                        </label>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            id="ca-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={isSignup ? 'new-password' : 'current-password'}
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 8 characters"
                            className={`${fieldClassName} pr-11`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 transition hover:text-zinc-200"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      {error && (
                        <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3.5 py-3 text-sm text-rose-200">
                          {error}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#08090D] shadow-[0_8px_28px_rgba(196,165,245,0.14)] transition hover:bg-[#F2ECFF] disabled:cursor-wait disabled:opacity-70"
                      >
                        {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                        <span>{submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}</span>
                        {!submitting && <ArrowRight className="h-4 w-4" />}
                      </button>
                      <p className="text-center text-xs text-zinc-400">
                        {isSignup ? 'Already have an account?' : 'New to CodeArena?'}{' '}
                        <button type="button" onClick={switchMode} className="font-medium text-[#D4B9FF] transition hover:text-white">
                          {isSignup ? 'Sign in' : 'Create an account'}
                        </button>
                      </p>
                    </>
                  ) : modal.mode === 'sandbox' ? (
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Select runtime environment</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['C++20', 'Python 3', 'Java 21'].map((lang) => (
                          <button
                            type="button"
                            key={lang}
                            onClick={() => setSelectedLang(lang)}
                            className={`rounded-xl border py-2.5 text-xs font-mono transition-all ${selectedLang === lang ? 'border-[#C4A5F5] bg-[#C4A5F5]/15 text-white' : 'border-white/10 bg-[#0D0E14] text-zinc-400 hover:text-white'}`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                      <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#08090D] transition hover:bg-white/90">
                        Launch {selectedLang} editor <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="ca-contact-email" className="block text-xs font-medium text-zinc-300">Your email</label>
                      <input
                        id="ca-contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className={fieldClassName}
                      />
                      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#08090D] transition hover:bg-white/90">
                        {modal.mode === 'contact' ? 'Send message' : 'Continue'} <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </form>
              ) : (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-5 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {isAuthMode ? 'You’re signed in' : modal.mode === 'sandbox' ? `${selectedLang} environment ready` : 'Request received'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {isAuthMode ? 'Your CodeArena dashboard is ready.' : modal.mode === 'sandbox' ? 'Your interactive coding workspace is ready.' : 'Thanks for reaching out to CodeArena.'}
                  </p>
                  <button type="button" onClick={onClose} className="mt-4 rounded-lg border border-white/10 bg-[#0D0E14] px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10">
                    Continue
                  </button>
                </div>
              )}

              {isAuthMode && !completed && (
                <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-500">
                  By continuing, you agree to use CodeArena respectfully and keep your account secure.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
