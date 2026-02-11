'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './page.css';

export default function ValentinePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [noButtonText, setNoButtonText] = useState('No 😢');
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const noTexts = [
    'No 😢',
    'Are you sure? 🥺',
    'Really? 💔',
    'Think again! 😭',
    'Please? 🙏',
    'Last chance! 😿',
  ];

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      size: 20 + Math.random() * 30,
      emoji: ['💕', '💖', '💗', '💓', '💝', '✨', '⭐'][Math.floor(Math.random() * 7)],
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth button evasion based on mouse proximity
  useEffect(() => {
    if (!noButtonRef.current || !containerRef.current || showSuccess) return;

    const checkProximity = () => {
      const button = noButtonRef.current;
      const container = containerRef.current;
      if (!button || !container) return;

      const buttonRect = button.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mousePosition.x - buttonCenterX, 2) +
        Math.pow(mousePosition.y - buttonCenterY, 2)
      );

      // Trigger evasion when mouse is within 120px
      if (distance < 120) {
        // Calculate angle away from mouse
        const angle = Math.atan2(
          buttonCenterY - mousePosition.y,
          buttonCenterX - mousePosition.x
        );

        // Move button away from mouse
        const moveDistance = 150;
        let newX = Math.cos(angle) * moveDistance + (Math.random() - 0.5) * 100;
        let newY = Math.sin(angle) * moveDistance + (Math.random() - 0.5) * 50;

        // Keep within bounds
        const maxX = containerRect.width - buttonRect.width - 20;
        const maxY = containerRect.height - buttonRect.height - 20;
        
        newX = Math.max(-maxX/2, Math.min(newX, maxX/2));
        newY = Math.max(-maxY/2, Math.min(newY, maxY/2));

        setNoButtonPosition({ x: newX, y: newY });

        // Update text and scale
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        if (newCount < noTexts.length) {
          setNoButtonText(noTexts[newCount]);
        }
        setYesButtonScale(1 + newCount * 0.08);
      }
    };

    const interval = setInterval(checkProximity, 50);
    return () => clearInterval(interval);
  }, [mousePosition, showSuccess, attemptCount]);

  const handleYesClick = () => {
    setShowSuccess(true);
    // Create celebration burst
    const burst = Array.from({ length: 50 }, (_, i) => ({
      id: 100 + i,
      x: 50,
      delay: i * 0.02,
      duration: 2,
      size: 30 + Math.random() * 20,
      emoji: ['💕', '💖', '💗', '💓', '💝'][i % 5],
    }));
    setParticles([...particles, ...burst]);
  };

  return (
    <div className="page-container" ref={containerRef}>
      {/* Animated particles background */}
      <div className="particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            initial={{ y: '100vh', x: `${particle.x}vw`, opacity: 0 }}
            animate={{
              y: '-100vh',
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ fontSize: `${particle.size}px` }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="emoji"
          animate={{
            scale: [1, 1.2, 1, 1.3, 1],
            rotate: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          💖
        </motion.div>

        <h1 className="question">Will you be my Valentine?</h1>
        <p className="subtitle">Please say yes! 🥺</p>

        <div className="buttons-container">
          <motion.button
            className="btn yes-btn"
            onClick={handleYesClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: yesButtonScale,
              boxShadow: [
                '0 8px 25px rgba(255, 107, 157, 0.4)',
                '0 12px 35px rgba(255, 107, 157, 0.6)',
                '0 8px 25px rgba(255, 107, 157, 0.4)',
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
              scale: { duration: 0.3 },
            }}
          >
            Yes! 💕
          </motion.button>

          <motion.button
            ref={noButtonRef}
            className="btn no-btn"
            animate={{
              x: noButtonPosition.x,
              y: noButtonPosition.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              mass: 0.5,
            }}
            whileHover={{ scale: 0.95 }}
          >
            {noButtonText}
          </motion.button>
        </div>
      </motion.div>

      {/* Success/Prank Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="celebration"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.h2
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                JUST KIDDING! 😂🤣
              </motion.h2>
              <p>It's a PRANK! Got you! 😜🎭</p>
              <div className="hearts-explosion">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, y: 0 }}
                    animate={{
                      scale: [0, 1.5, 1],
                      y: [0, -50 - i * 10, -100 - i * 20],
                      x: [(i - 5) * 10, (i - 5) * 30],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    {['💕', '💖', '💗', '💓', '💝'][i % 5]}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
