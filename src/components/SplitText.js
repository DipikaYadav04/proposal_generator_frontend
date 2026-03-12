import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const textRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateText();
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  const animateText = () => {
    const chars = textRef.current.querySelectorAll('.char');
    
    gsap.set(chars, from);
    
    gsap.to(chars, {
      ...to,
      duration: duration,
      ease: ease,
      stagger: delay / 1000,
      onComplete: () => {
        if (onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      }
    });
  };

  const splitTextIntoChars = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char"
        style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={textRef} className={className} style={{ textAlign }}>
      {splitType === 'chars' ? splitTextIntoChars(text) : text}
    </div>
  );
};

export default SplitText;
