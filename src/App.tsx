import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { Home } from "./screens/Home";

// データルーターを使う（画面遷移の View Transitions に必要）。
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

/** アプリの入口。全画面で共有するもの（トースト）でルーターを包む。 */
export function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
