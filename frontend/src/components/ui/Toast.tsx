import React, { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>( []);

  useEffect(() => {
    const timeoutIds = toasts.map(toast => setTimeout(() => {
      setToasts(toasts.filter(t => t.id !== toast.id));
    }, toast.duration ?? 5000));

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [toasts]);

  return (
    <div>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="
            fixed bottom-4 right-4 max-w-md w-full
            rounded-lg px-4 py-3 text-left shadow-lg animate-in fade-in-0
            ${
              toast.type === 'success'
                ? 'bg-success text-success-foreground'
                : toast.type === 'error'
                  ? 'bg-destructive text-destructive-foreground'
                  : toast.type === 'warning'
                    ? 'bg-warning text-warning-foreground'
                    : 'bg-primary text-primary-foreground'
            }
          "
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            {toast.type === 'success' && (
              <svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M9 5a3 3 0 013 3l9-5a3 3 0 01-3 3l-9-5a3 3 0 01-3-3l9 5z"
                />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.5 5.5a.5.5 0 010-1h.793l-3.314-3.314a.5.5 0 11.708-.708l4.5 4.5a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l-3.314 3.314a.5.5 0 01-.106-.105H7.307l-3.314 3.314a.5.5 0 11-.708-.708l4.5-4.5a.5.5 0 01.708 0l4.5 4.5a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l-3.314-3.314z"
                />
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M8.258 3.483a.323.323 0 01.126.053l7.855 1.818a.31.31 0 01.18.202l-1.388.31a.319.319 0 00-.02.21l-7.866 1.823a.323.323 0 01-.18-.18l1.39-3.688a.315.315 0 00-.02-.22l7.854-1.818a.32.32 0 01.053-.126l-1.828 7.855a.319.319 0 00.21.02l-3.69 1.388a.316.316 0 01-.21.02l-7.865 1.818z"
                />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 100-2 1 1 0 000 2zm8.5 5.5a.5.5 0 010 1h-2a.5.5 0 010-1h2zm-1.5-7a.5.5 0 010 1h-2a.5.5 0 010-1h2zm-11 2.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm0-6a.5.5 0 01.5-.5H7a.5.5 0 010-1h1zm8 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z"
                />
              </svg>
            )}
            {toast.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : toast.type === 'error'
              ? <X className="h-4 w-4" />
              : toast.type === 'warning'
                ? <AlertCircle className="h-4 w-4" />
                : null}
            <span className="flex-1 ml-3 text-sm">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts([...toasts, { ...props, id }]);
  };

  return { toast };
};

export default ToastContainer;