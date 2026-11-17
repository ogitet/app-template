import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Show = (message: string) => void;
const ToastContext = createContext<Show>(() => {});

/** トーストの表示先。アプリの入口で1回だけ置く。新しい文言が来たら前のものを置き換え、2秒で消す。 */
export function ToastProvider({ children }: { children: ReactNode }) {
  // 文字列ではなくオブジェクトで持つ。同じ文言を続けて出したときも別の値になり、2秒を数え直せる
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const show = useCallback<Show>((message) => setToast({ message }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/** トーストを出す関数を返す。ToastProvider の外では何も表示しない。 */
export function useToast(): Show {
  return useContext(ToastContext);
}
