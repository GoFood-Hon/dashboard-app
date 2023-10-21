import * as React from "react"
import * as ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import LoadingCircle from "./components/LoadingCircle"
import { ThemeProvider } from "./context/ThemeProvider"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from "./store/store"
import "@mantine/core/styles.css"

import { MantineProvider } from "@mantine/core"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Suspense fallback={LoadingCircle}>
        <MantineProvider>
          <ThemeProvider>
            <App />
            <Toaster position="top-right" />
          </ThemeProvider>
        </MantineProvider>
      </React.Suspense>
    </Provider>
  </React.StrictMode>
)
