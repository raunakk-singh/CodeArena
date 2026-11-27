import React, { useState } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import CodeArenaLogo from './CodeArenaLogo';
import InteractiveModal from './InteractiveModal';

const initialModal = { isOpen: false, mode: 'login', title: '', subtitle: '' };

export default function DashboardAccess({ onAuthenticated }) {
  const [modal, setModal] = useState(initialModal);

  const openAuth = (mode) => {
    setModal({ isOpen: true, mode, title: '', subtitle: '' });
  };

  const closeModal = () => setModal((current) => ({ ...current, isOpen: false }));
  const switchMode = (mode) => setModal((current) => ({ ...current, isOpen: true, mode }));

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090D] px-4 py-12 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_50%,#000_45%,transparent_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7775EF]/15 blur-[130px]" />

      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111218]/90 p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-9">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C4A5F5]/20 bg-[#C4A5F5]/10 shadow-[0_0_32px_rgba(196,165,245,0.12)]">
          <LockKeyhole className="h-6 w-6 text-[#D4B9FF]" />
        </div>
        <div className="mb-3 flex items-center justify-center gap-2">
          <CodeArenaLogo className="h-7 w-7" />
          <span className="text-sm font-semibold">Code<span className="text-[#C4A5F5]">Arena</span></span>
        </div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C4A5F5]">Member workspace</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your dashboard is waiting</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
          Sign in to continue to your progress, activity, and personalized problem workspace, or create an account to get started.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openAuth('login')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#08090D] transition hover:bg-[#F2ECFF]"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => openAuth('signup')}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#C4A5F5]/40 hover:bg-[#C4A5F5]/10"
          >
            Create account
          </button>
        </div>
      </section>

      <InteractiveModal
        modal={modal}
        onClose={closeModal}
        onSwitchMode={switchMode}
        onAuthenticated={onAuthenticated}
      />
    </main>
  );
}
