"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type NotificationType = "success" | "error" | "info";

type NotificationState = {
  id: number;
  message: string;
  description?: string;
  type: NotificationType;
  durationMs: number;
  remainingMs: number;
};

type ShowNotificationInput = {
  message: string;
  description?: string;
  type?: NotificationType;
  durationMs?: number;
};

type NotificationContextValue = {
  notification: NotificationState | null;
  showNotification: (input: ShowNotificationInput) => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
}

type NotificationProviderProps = {
  children: React.ReactNode;
};

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const durationRef = useRef<number | null>(null);
  const idRef = useRef(1);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startedAtRef.current = null;
    durationRef.current = null;
  }, []);

  const hideNotification = useCallback(() => {
    clearTimer();
    setNotification(null);
  }, [clearTimer]);

  const startTimer = useCallback(
    (durationMs: number) => {
      clearTimer();
      startedAtRef.current = performance.now();
      durationRef.current = durationMs;

      timerRef.current = window.setInterval(() => {
        const startedAt = startedAtRef.current;
        const totalDuration = durationRef.current;
        if (startedAt == null || totalDuration == null) return;

        const elapsed = performance.now() - startedAt;
        const remaining = Math.max(totalDuration - elapsed, 0);

        setNotification((prev) => {
          if (!prev) return null;
          return { ...prev, remainingMs: remaining };
        });

        if (remaining <= 0) {
          clearTimer();
          window.setTimeout(hideNotification, 150);
        }
      }, 50);
    },
    [clearTimer, hideNotification],
  );

  const showNotification = useCallback(
    (input: ShowNotificationInput) => {
      const {
        message,
        description,
        type = "success",
        durationMs = 8000,
      } = input;

      const id = idRef.current++;
      const safeDuration = Math.max(durationMs, 1000);

      setNotification({
        id,
        message,
        description,
        type,
        durationMs: safeDuration,
        remainingMs: safeDuration,
      });

      startTimer(safeDuration);
    },
    [startTimer],
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const value = useMemo(
    () => ({
      notification,
      showNotification,
      hideNotification,
    }),
    [notification, showNotification, hideNotification],
  );

  const progress =
    notification && notification.durationMs > 0
      ? Math.min(
          1,
          Math.max(
            0,
            1 - notification.remainingMs / notification.durationMs,
          ),
        )
      : 0;

  const secondsRemaining = notification
    ? Math.max(Math.ceil(notification.remainingMs / 1000), 0)
    : 0;

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <AnimatePresence>
          {notification && (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="notification-banner pointer-events-auto max-w-xl flex-1 rounded-xl border px-4 py-3 text-xs shadow-lg backdrop-blur-md"
              data-variant={notification.type}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border border-emerald-300/80 bg-emerald-500/15 text-[11px] font-semibold text-emerald-200 flex items-center justify-center">
                  {notification.type === "error"
                    ? "!"
                    : notification.type === "info"
                      ? "i"
                      : "✓"}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] font-semibold">
                    {notification.message}
                  </p>
                  {notification.description && (
                    <p className="text-[11px] text-slate-300">
                      {notification.description}
                    </p>
                  )}
                  {secondsRemaining > 0 && (
                    <p className="text-[10px] text-slate-400">
                      This message will close in {secondsRemaining}{" "}
                      {secondsRemaining === 1 ? "second" : "seconds"}.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={hideNotification}
                  className="ml-2 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-600/70 text-[11px] text-slate-300 transition hover:border-slate-400 hover:text-slate-100"
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800/70">
                <div
                  className="h-full rounded-full bg-emerald-400/90 transition-[width] duration-100 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

