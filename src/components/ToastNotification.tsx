import { useEffect, useState, useCallback } from 'react';
import { useStore } from '../stores/useStore';
import type { Toast } from '../stores/useStore';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50 dark:bg-emerald-950/80',
    border: 'border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    progressColor: 'bg-emerald-500',
    shadow: 'shadow-emerald-100/50 dark:shadow-emerald-900/30',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 dark:bg-red-950/80',
    border: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800 dark:text-red-200',
    textColor: 'text-red-700 dark:text-red-300',
    progressColor: 'bg-red-500',
    shadow: 'shadow-red-100/50 dark:shadow-red-900/30',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-950/80',
    border: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-700 dark:text-amber-300',
    progressColor: 'bg-amber-500',
    shadow: 'shadow-amber-100/50 dark:shadow-amber-900/30',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/80',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800 dark:text-blue-200',
    textColor: 'text-blue-700 dark:text-blue-300',
    progressColor: 'bg-blue-500',
    shadow: 'shadow-blue-100/50 dark:shadow-blue-900/30',
  },
};

const defaultTitles: Record<string, string> = {
  success: 'Succès',
  error: 'Erreur',
  warning: 'Attention',
  info: 'Information',
};

function SingleToast({ toast, index }: { toast: Toast; index: number }) {
  const { removeToast } = useStore();
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const config = toastConfig[toast.type];
  const Icon = config.icon;
  const title = toast.title || defaultTitles[toast.type];

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  }, [toast.id, removeToast]);

  useEffect(() => {
    if (isPaused) return;
    const elapsed = Date.now() - toast.timestamp;
    const remaining = Math.max(0, toast.duration - elapsed);
    const startProgress = (remaining / toast.duration) * 100;
    setProgress(startProgress);

    const interval = setInterval(() => {
      const now = Date.now();
      const el = now - toast.timestamp;
      const p = Math.max(0, ((toast.duration - el) / toast.duration) * 100);
      setProgress(p);
      if (p <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.timestamp, toast.duration, isPaused]);

  return (
    <div
      className={`toast-item pointer-events-auto relative w-80 overflow-hidden rounded-xl border backdrop-blur-lg transition-all duration-300 ${config.bg} ${config.border} ${config.shadow} shadow-xl ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3 p-3.5">
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-bold uppercase tracking-wide ${config.titleColor}`}>
            {title}
          </p>
          <p className={`mt-0.5 text-sm leading-snug ${config.textColor}`}>
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className={`shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${config.textColor} opacity-50 hover:opacity-100`}
          aria-label="Fermer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] w-full bg-black/5 dark:bg-white/10">
        <div
          className={`h-full ${config.progressColor} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      {toasts.slice(-5).map((toast, index) => (
        <SingleToast key={toast.id} toast={toast} index={index} />
      ))}
    </div>
  );
}
