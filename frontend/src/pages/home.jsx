
import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CodeEditor from '../components/CodeEditor';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import InteractiveModal from '../components/InteractiveModal';
import PublicProblems from '../components/PublicProblems';

function Home({ onAuthenticated }) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    mode: 'signup'
  });

  const handleOpenModal = ({ title, subtitle, mode }) => {
    setModal({ isOpen: true, title, subtitle, mode });
  };

  const handleSwitchMode = (mode) => {
    setModal((current) => ({ ...current, isOpen: true, mode }));
  };

  const handleCloseModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white antialiased selection:bg-[#C4A5F5]/30 selection:text-white">
      <Navbar onOpenModal={handleOpenModal} />

      <main>
        <Hero onOpenModal={handleOpenModal}>
          <CodeEditor />
        </Hero>

        <PublicProblems />
        <Stats />
        <Features />
        <HowItWorks />
        <FinalCTA onOpenModal={handleOpenModal} />
      </main>

      <Footer onOpenModal={handleOpenModal} />

      <InteractiveModal
        modal={modal}
        onClose={handleCloseModal}
        onSwitchMode={handleSwitchMode}
        onAuthenticated={onAuthenticated}
      />
    </div>
  );
}

export default Home;
