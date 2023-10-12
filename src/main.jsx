import * as React from "react"
import * as ReactDOM from "react-dom/client"
import "./index.css"
import { ThemeProvider } from "./context/ThemeProvider"
import LoadingCircle from "./components/LoadingCircle"
import App from "./App"
import { AuthProvider } from "./context/AuthProvider"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <React.Suspense fallback={LoadingCircle}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </React.Suspense>
  </React.StrictMode>
)
