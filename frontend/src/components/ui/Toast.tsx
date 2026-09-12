import { useEffect, useState } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((current) => [...current, { ...props, id }]);
  };

  const dismiss = (id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const timeoutIds = toasts
      .filter((item) => item.duration !== 0)
      .map((item) =>
        window.setTimeout(() => dismiss(item.id), item.duration ?? 5000)
      );

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [toasts]);

  return { toast, toasts, dismiss };
};

const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 shadow-lg ${
            toast.type === 'success'
              ? 'bg-success text-success-foreground'
              : toast.type === 'error'
                ? 'bg-destructive text-destructive-foreground'
                : toast.type === 'warning'
                  ? 'bg-warning text-warning-foreground'
                  : 'bg-primary text-primary-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <Check className="h-4 w-4" />}
            {toast.type === 'error' && <X className="h-4 w-4" />}
            {toast.type === 'warning' && <AlertCircle className="h-4 w-4" />}
            <span className="flex-1 text-sm">{toast.message}</span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ToastContainer as Toast };
export default ToastContainer;
