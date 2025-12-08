"use client"

import { useRef } from "react"
import { useInView, useScroll, useTransform, type MotionValue } from "motion/react"

export type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale"

interface ScrollAnimationOptions {
  threshold?: number
  once?: boolean
  margin?: string
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.2, once = true, margin = "-80px" } = options
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin, amount: threshold })

  return { ref, isInView }
}

export function useStaggeredInView(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.15, once = true, margin = "-50px" } = options
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin, amount: threshold })

  return { ref, isInView }
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

export function useSectionScroll() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  return { ref, scrollYProgress }
}

export const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}
