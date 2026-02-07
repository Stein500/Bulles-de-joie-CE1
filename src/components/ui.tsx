import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Upload } from 'lucide-react';

// ===== NOTIFICATION SYSTEM =====
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: () => void;
}

const notificationConfig = {
  success: { icon: CheckCircle, bg: 'from-green-500 to-emerald-600', border: 'border-green-400' },
  error: { icon: AlertCircle, bg: 'from-red-500 to-rose-600', border: 'border-red-400' },
  warning: { icon: AlertTriangle, bg: 'from-yellow-500 to-orange-500', border: 'border-yellow-400' },
  info: { icon: Info, bg: 'from-blue-500 to-cyan-600', border: 'border-blue-400' },
};

export const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const config = notificationConfig[type];
  const Icon = config.icon;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = type === 'error' ? 6000 : 4000;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onClose, type]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`relative bg-gradient-to-r ${config.bg} ${config.border} border-l-4 
        rounded-xl shadow-2xl p-4 flex items-center gap-3 overflow-hidden`}
    >
      <Icon className="w-6 h-6 text-white flex-shrink-0" />
      <p className="text-white font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white transition-colors p-1"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-50"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
};

interface NotificationContainerProps {
  notifications: Array<{ id: string; type: NotificationType; message: string }>;
  onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
}) => {
  return (
    <div className="fixed top-4 right-4 z-[100] w-96 max-w-[90vw] space-y-3">
      <AnimatePresence>
        {notifications.map((n) => (
          <Notification
            key={n.id}
            id={n.id}
            type={n.type}
            message={n.message}
            onClose={() => onRemove(n.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ===== MODAL =====
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`modal-content ${sizeClasses[size]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold gradient-text">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ===== IMAGE UPLOAD =====
interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onChange(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <label className={`block cursor-pointer group ${className}`}>
      <div className="text-white/80 text-sm mb-2 font-medium">{label}</div>
      <div className="h-24 rounded-xl border-2 border-dashed border-fuchsia-500/50 
        group-hover:border-citron-500 transition-all duration-300 
        flex items-center justify-center overflow-hidden bg-black/20">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-contain p-2" />
        ) : (
          <div className="flex flex-col items-center text-gray-500 group-hover:text-citron-500 transition-colors">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">Cliquer pour upload</span>
          </div>
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </label>
  );
};

// ===== ANIMATED COUNTER =====
interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{displayValue}</span>;
};

// ===== LOADING SPINNER =====
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeMap[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-fuchsia-500/30" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-500 animate-spin" />
      </div>
    </div>
  );
};

// ===== THEME SELECTOR =====
interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: 'neon', name: 'Néon', colors: ['#FF00FF', '#CCFF00'] },
  { id: 'ocean', name: 'Océan', colors: ['#00CED1', '#48D1CC'] },
  { id: 'sunset', name: 'Coucher', colors: ['#FF6B6B', '#FFE66D'] },
  { id: 'forest', name: 'Forêt', colors: ['#2ECC71', '#27AE60'] },
  { id: 'royal', name: 'Royal', colors: ['#9B59B6', '#E74C3C'] },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          className={`relative p-3 rounded-xl transition-all duration-300 ${
            currentTheme === theme.id
              ? 'ring-2 ring-white scale-105'
              : 'hover:scale-105'
          }`}
          style={{
            background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
          }}
        >
          <span className="text-white text-xs font-bold drop-shadow-lg">{theme.name}</span>
          {currentTheme === theme.id && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-3 h-3 text-fuchsia-500" />
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
};

// ===== TRIMESTER TABS =====
interface TrimesterTabsProps {
  selected: 'T1' | 'T2' | 'T3';
  onChange: (t: 'T1' | 'T2' | 'T3') => void;
}

export const TrimesterTabs: React.FC<TrimesterTabsProps> = ({ selected, onChange }) => {
  const trimesters: Array<'T1' | 'T2' | 'T3'> = ['T1', 'T2', 'T3'];
  const labels = { T1: '1er Trim.', T2: '2ème Trim.', T3: '3ème Trim.' };

  return (
    <div className="flex gap-2 p-1 bg-black/30 rounded-xl">
      {trimesters.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            selected === t
              ? 'bg-gradient-to-r from-fuchsia-500 to-citron-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {labels[t]}
        </button>
      ))}
    </div>
  );
};

// ===== EMPTY STATE =====
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-citron-500/20 
        flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-4">{description}</p>}
      {action}
    </motion.div>
  );
};
