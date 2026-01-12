"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";

// ============================================
// Motion Preferences Hook
// ============================================
export function useMotionPrefs() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Check localStorage for user preference
    const storedPref = localStorage.getItem("sen-low-motion");
    if (storedPref === "true") {
      setLowPowerMode(true);
      document.documentElement.classList.add("low-motion");
    }

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleLowPowerMode = useCallback(() => {
    setLowPowerMode((prev) => {
      const newVal = !prev;
      localStorage.setItem("sen-low-motion", String(newVal));
      document.documentElement.classList.toggle("low-motion", newVal);
      return newVal;
    });
  }, []);

  const shouldAnimate = !reducedMotion && !lowPowerMode;

  return { reducedMotion, lowPowerMode, toggleLowPowerMode, shouldAnimate };
}

// ============================================
// Page Transition Hook
// ============================================
export function usePageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const { shouldAnimate } = useMotionPrefs();

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    if (!shouldAnimate) {
      containerRef.current.style.opacity = "1";
      return;
    }

    hasAnimated.current = true;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      }
    );

    // Stagger children with data-stagger attribute
    const children = containerRef.current.querySelectorAll("[data-stagger]");
    if (children.length > 0) {
      gsap.fromTo(
        children,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.1,
        }
      );
    }
  }, [shouldAnimate]);

  return { containerRef };
}

// ============================================
// Stagger Animation Hook
// ============================================
export function useStaggerAnimation<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const { shouldAnimate } = useMotionPrefs();

  const animateIn = useCallback(() => {
    if (!containerRef.current || !shouldAnimate) return;

    const children = containerRef.current.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
      }
    );
  }, [shouldAnimate]);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return { containerRef };
}

// ============================================
// Progress Ring Animation
// ============================================
export function useProgressRing(targetPercent: number, duration: number = 0.8) {
  const circleRef = useRef<SVGCircleElement>(null);
  const { shouldAnimate } = useMotionPrefs();

  useEffect(() => {
    if (!circleRef.current) return;

    const circumference = 2 * Math.PI * 40; // radius = 40
    const offset = circumference - (targetPercent / 100) * circumference;

    if (!shouldAnimate) {
      circleRef.current.style.strokeDashoffset = String(offset);
      return;
    }

    gsap.to(circleRef.current, {
      strokeDashoffset: offset,
      duration,
      ease: "power2.out",
    });
  }, [targetPercent, duration, shouldAnimate]);

  return { circleRef };
}

// ============================================
// Shake Animation (for overspend)
// ============================================
export function shakeElement(element: HTMLElement) {
  gsap
    .timeline()
    .to(element, { x: -4, duration: 0.05 })
    .to(element, { x: 4, duration: 0.05 })
    .to(element, { x: -3, duration: 0.05 })
    .to(element, { x: 3, duration: 0.05 })
    .to(element, { x: 0, duration: 0.05 });
}

// ============================================
// Success Pop Animation
// ============================================
export function popElement(element: HTMLElement) {
  gsap
    .timeline()
    .fromTo(
      element,
      { scale: 0.9, opacity: 0 },
      { scale: 1.05, opacity: 1, duration: 0.15, ease: "power2.out" }
    )
    .to(element, { scale: 1, duration: 0.1, ease: "power2.inOut" });
}

// ============================================
// Counter Animation
// ============================================
export function useCountUp(targetValue: number, duration: number = 1) {
  const [displayValue, setDisplayValue] = useState(0);
  const { shouldAnimate } = useMotionPrefs();

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayValue(targetValue);
      return;
    }

    const obj = { value: 0 };
    gsap.to(obj, {
      value: targetValue,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplayValue(Math.round(obj.value * 100) / 100),
    });
  }, [targetValue, duration, shouldAnimate]);

  return displayValue;
}

// ============================================
// Button Press Animation Hook
// ============================================
export function useButtonPress() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePress = useCallback(() => {
    if (!buttonRef.current) return;

    gsap
      .timeline()
      .to(buttonRef.current, { scale: 0.95, duration: 0.1, ease: "power2.out" })
      .to(buttonRef.current, { scale: 1, duration: 0.15, ease: "power2.out" });
  }, []);

  return { buttonRef, handlePress };
}
