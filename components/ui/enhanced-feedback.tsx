"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md",
        colors[type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        {description && (
          <div className="text-sm opacity-90 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id" | "onClose">) => void
  removeToast: (id: string) => void
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Progress indicator for streaming operations
interface StreamingProgressProps {
  steps: { name: string; status: "pending" | "loading" | "complete" | "error" }[]
  currentStep: number
  className?: string
}

export function StreamingProgress({ steps, currentStep, className }: StreamingProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Processing Steps</h3>
        <span className="text-sm text-gray-500">
          {steps.filter(s => s.status === "complete").length} / {steps.length} complete
        </span>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
              step.status === "complete" && "bg-green-100 text-green-800",
              step.status === "loading" && "bg-blue-100 text-blue-800",
              step.status === "error" && "bg-red-100 text-red-800",
              step.status === "pending" && "bg-gray-100 text-gray-500"
            )}>
              {step.status === "complete" && <CheckCircle className="w-4 h-4" />}
              {step.status === "loading" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"
                />
              )}
              {step.status === "error" && <XCircle className="w-4 h-4" />}
              {step.status === "pending" && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
            </div>
            
            <span className={cn(
              "flex-1 text-sm",
              step.status === "complete" && "text-gray-900",
              step.status === "loading" && "text-blue-900 font-medium",
              step.status === "error" && "text-red-900",
              step.status === "pending" && "text-gray-500"
            )}>
              {step.name}
            </span>
            
            {step.status === "loading" && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-1 bg-blue-200 rounded-full overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-1/3 bg-blue-600 rounded-full"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Real-time metrics display
interface MetricsDisplayProps {
  metrics: { label: string; value: number; change?: number; format?: "number" | "percentage" | "currency" }[]
  className?: string
}

export function MetricsDisplay({ metrics, className }: MetricsDisplayProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg border shadow-sm"
        >
          <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {formatValue(metric.value, metric.format)}
            </motion.span>
          </div>
          {metric.change !== undefined && (
            <div className={cn(
              "text-xs flex items-center",
              metric.change > 0 ? "text-green-600" : metric.change < 0 ? "text-red-600" : "text-gray-500"
            )}>
              {metric.change > 0 ? "+" : ""}{metric.change}%
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function formatValue(value: number, format?: "number" | "percentage" | "currency"): string {
  switch (format) {
    case "percentage":
      return `${value}%`
    case "currency":
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    default:
      return value.toLocaleString()
  }
}
