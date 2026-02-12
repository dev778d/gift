'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

export default function ValentinePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [noButtonText, setNoButtonText] = useState('No 😢');
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Motion values for smooth physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring config for "sleek" feeling
  const springConfig = { stiffness: 150, damping: 20, mass: 0.6 };
  const buttonX = useSpring(0, springConfig);
  const buttonY = useSpring(0, springConfig);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const noTexts = [
    'No 😢',
    'Are you sure? 🥺',
    'Really? 💔',
    'Think again! 😭',
    'Please? 🙏',
    'Last chance! 😿',
    'You are mean! 😤',
    'I am crying... 🌊',
    'Just click Yes! ✨'
  ];

  // Particle background data
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      emoji: ['💖', '✨', '🌸', '💕', '🍭'][Math.floor(Math.random() * 5)]
    }));
  }, []);

  // Handle Mouse Movement for Repulsion
  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      mouseX.set(clientX);
      mouseY.set(clientY);

      if (!noButtonRef.current || showSuccess) return;

      const rect = noButtonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
      );

      // Repulsion logic
      if (distance < 150) {
        const angle = Math.atan2(centerY - clientY, centerX - clientX);
        const force = (150 - distance) / 150;
        const moveDist = force * 250;

        let newX = buttonX.get() + Math.cos(angle) * moveDist;
        let newY = buttonY.get() + Math.sin(angle) * moveDist;

        // Boundary checks (roughly keep it on screen)
        const padding = 100;
        if (Math.abs(newX) > window.innerWidth / 2 - padding) newX = (window.innerWidth / 2 - padding) * Math.sign(newX);
        if (Math.abs(newY) > window.innerHeight / 2 - padding) newY = (window.innerHeight / 2 - padding) * Math.sign(newY);

        buttonX.set(newX);
        buttonY.set(newY);

        // Update state for Yes button growth
        if (distance < 80) {
          setAttemptCount(prev => {
            const next = prev + 1;
            if (next % 5 === 0) { // Change text every few "near misses"
               setNoButtonText(noTexts[Math.min(Math.floor(next/5), noTexts.length - 1)]);
            }
            return next;
          });
          setYesButtonScale(1 + (attemptCount * 0.02));
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showSuccess, attemptCount, buttonX, buttonY, mouseX, mouseY]);

  const handleYesClick = () => {
    setShowSuccess(true);
  };

  // Handle No button tap/click - make it jump away
  const handleNoButtonInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    // Jump to a random position
    const randomX = (Math.random() - 0.5) * (window.innerWidth / 2 - 150);
    const randomY = (Math.random() - 0.5) * (window.innerHeight / 2 - 100);
    
    buttonX.set(randomX);
    buttonY.set(randomY);
    
    // Update text and scale
    setAttemptCount(prev => {
      const next = prev + 1;
      if (next < noTexts.length) {
        setNoButtonText(noTexts[next]);
      }
      return next;
    });
    setYesButtonScale(1 + (attemptCount * 0.03));
  };

  // Parallax effect for the card
  const rotateX = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [5, -5]);
  const rotateY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-5, 5]);

  return (
    <div className="page-container" ref={containerRef}>
      {/* Dynamic Background */}
      <motion.div className="bg-glow" style={{ 
        left: mouseX, 
        top: mouseY,
        transform: 'translate(-50%, -50%)'
      }} />
      
      <div className="particles-container">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="floating-emoji"
            initial={{ y: '110vh', x: `${p.x}vw`, opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.6, 0.6, 0],
              rotate: 360 
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ fontSize: p.size }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="glass-card"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div 
          className="main-emoji"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {showSuccess ? '🤡' : '💝'}
        </motion.div>

        <h1 className="main-title">
          {showSuccess ? "GOTCHA!" : "Will you be my Valentine?"}
        </h1>
        
        <p className="main-subtitle">
          {showSuccess ? "It was all a prank! 😂" : "I promise I'm nice... mostly. 🥺"}
        </p>

        {!showSuccess && (
          <div className="actions-wrapper">
            <motion.button
              className="action-btn yes-primary"
              onClick={handleYesClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ scale: yesButtonScale }}
            >
              Yes! 💕
            </motion.button>

            <motion.button
              ref={noButtonRef}
              className="action-btn no-secondary"
              style={{ x: buttonX, y: buttonY }}
              transition={{ type: 'spring', ...springConfig }}
              onClick={handleNoButtonInteraction}
              onTouchStart={handleNoButtonInteraction}
            >
              {noButtonText}
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              className="prank-reveal"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div className="reveal-content">
                <p>You actually clicked Yes? <br/><span>How sweet! But...</span></p>
                <div className="meme-text">PRANKED! 🎭</div>
                <motion.button 
                  className="reset-btn"
                  onClick={() => {
                    setShowSuccess(false);
                    setAttemptCount(0);
                    setYesButtonScale(1);
                    buttonX.set(0);
                    buttonY.set(0);
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  Try Again? 🔄
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="vignette" />
    </div>
  );
}