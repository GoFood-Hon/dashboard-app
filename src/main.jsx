import * as React from "react"
import * as ReactDOM from "react-dom/client"
import "./index.css"
import "@mantine/dates/styles.css"
import App from "./App"
import LoadingCircle from "./components/LoadingCircle"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"

import "@mantine/core/styles.css"
import "mapbox-gl/dist/mapbox-gl.css"
import "@mantine/notifications/styles.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Suspense fallback={LoadingCircle}>
        <MantineProvider>
          <Notifications />
          <App />
          <Toaster position="top-right" />
        </MantineProvider>
      </React.Suspense>
    </Provider>
  </React.StrictMode>
)
