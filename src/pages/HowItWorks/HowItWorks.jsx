import React, { useEffect, useRef, useState } from 'react';
import '../../styles/howitworks/how-it-works.css';

// Layout Components
import HowItWorksLayout from '../../components/HowItWorks/layout/HowItWorksLayout';
import MobileHowItWorksLayout from '../../components/HowItWorks/Mobile/layout/MobileHowItWorksLayout';

const HowItWorks = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('section-shop');
  const observerRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 680px)');
    const handleChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const revealElements = document.querySelectorAll('.hok-hiw-r');
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('hok-hiw-v');
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { 
      threshold: isMobile ? 0.06 : 0.07 
    });

    revealElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMobile]);

  // Chapter nav auto-highlight on scroll
  useEffect(() => {
    const sections = ['section-shop', 'section-modes', 'section-sell', 'section-pol', 'section-faq'];
    const btnIds = ['cnb-shop', 'cnb-modes', 'cnb-sell', 'cnb-pol', 'cnb-faq'];
    const threshold = isMobile ? 180 : 200;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      let currentIndex = 0;

      sections.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const offsetTop = rect.top + window.pageYOffset;
          if (offsetTop - threshold <= scrollY) {
            currentIndex = index;
          }
        }
      });

      const sectionId = sections[currentIndex];
      setActiveSection(sectionId);

      // Update nav buttons
      document.querySelectorAll('.hok-hiw-cn-btn, .hok-hiw-chap-btn').forEach((btn) => {
        btn.classList.remove('hok-hiw-lit');
        if (btn.id === btnIds[currentIndex]) {
          btn.classList.add('hok-hiw-lit');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // hokScroll function
  useEffect(() => {
    window.hokScroll = (id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const chapNav = document.getElementById('chapnav');
      const header = document.querySelector('header');
      
      const chapH = chapNav ? chapNav.offsetHeight : 0;
      const headerH = header ? header.offsetHeight : 0;
      
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - chapH - 8;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
  }, []);

  return (
    <div className="hok-hiw-page">
      {isMobile ? (
        <MobileHowItWorksLayout activeSection={activeSection} />
      ) : (
        <HowItWorksLayout activeSection={activeSection} />
      )}
    </div>
  );
};

export default HowItWorks;