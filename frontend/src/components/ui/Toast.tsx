import { useEffect, useState } from 'react';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const timeoutIds = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, toast.duration ?? 5000)
    );

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [toasts]);

  return (
    <div>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`fixed bottom-4 right-4 max-w-md w-full rounded-lg px-4 py-3 text-left shadow-lg ${
            toast.type === 'success'
              ? 'bg-success text-success-foreground'
              : toast.type === 'error'
                ? 'bg-destructive text-destructive-foreground'
                : toast.type === 'warning'
                  ? 'bg-warning text-warning-foreground'
                  : 'bg-primary text-primary-foreground'
          }`}
        >
          <span className="text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => ({
  toast: (_props: Omit<ToastData, 'id'>) => {
    // Toast state is currently managed by ToastContainer.
  },
});

export default ToastContainer;
