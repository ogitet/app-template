import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Show = (message: string) => void;
const ToastContext = createContext<Show>(() => {});

/** トーストの表示先。アプリの入口で1回だけ置く。新しい文言が来たら前のものを置き換え、2秒で消す。 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<Show>((m) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2000);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/** トーストを出す関数を返す。ToastProvider の外では何も表示しない。 */
export function useToast(): Show {
  return useContext(ToastContext);
}
