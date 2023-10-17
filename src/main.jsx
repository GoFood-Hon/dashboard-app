import * as React from "react"
import * as ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import LoadingCircle from "./components/LoadingCircle"
import { ThemeProvider } from "./context/ThemeProvider"
import { AuthProvider } from "./context/AuthProvider"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from "./store/store"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Suspense fallback={LoadingCircle}>
        <AuthProvider>
          <ThemeProvider>
            <App />
            <Toaster position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </React.Suspense>
    </Provider>
  </React.StrictMode>
)
