"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 0.5, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, delay = 0, duration = 0.5, direction = "left", className }: FadeInProps & { direction?: "left" | "right" | "up" | "down" }) {
  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { x: -50, opacity: 0 }
      case "right": return { x: 50, opacity: 0 }
      case "up": return { y: -50, opacity: 0 }
      case "down": return { y: 50, opacity: 0 }
      default: return { x: -50, opacity: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, duration = 0.5, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StreamingText({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
  return (
    <motion.span
      initial={{ width: 0 }}
      animate={{ width: "auto" }}
      transition={{ delay, duration: text.length / speed }}
      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
    >
      {text}
    </motion.span>
  )
}

export function CountUp({ value, duration = 1, delay = 0 }: { value: number; duration?: number; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration }}
      >
        {value}
      </motion.span>
    </motion.span>
  )
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
