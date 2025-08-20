"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Toast = { id: number; title?: string; message: string; type?: "success" | "error" | "info"; duration?: number }
type Ctx = { toast: (t: Omit<Toast, "id">) => void }

const ToastContext = createContext<Ctx | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <ToasterProvider>")
  return ctx.toast
}

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = idRef.current++
    const item: Toast = { id, type: "info", duration: 2500, ...t }
    setToasts((cur) => [...cur, item])
    if (item.duration && item.duration > 0) {
      setTimeout(() => dismiss(id), item.duration)
    }
  }, [dismiss])

  const value = useMemo<Ctx>(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <div className="fixed top-4 right-4 z-[1000] space-y-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={
                  "rounded-xl px-4 py-3 shadow-soft text-sm " +
                  (t.type === "success"
                    ? "bg-emerald-600 text-white"
                    : t.type === "error"
                    ? "bg-red-600 text-white"
                    : "bg-gray-900 text-white")
                }
                role="status"
                onClick={() => dismiss(t.id)}
              >
                {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
                <div>{t.message}</div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}
