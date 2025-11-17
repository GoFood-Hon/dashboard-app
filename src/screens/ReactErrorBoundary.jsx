import React from "react"
import { AppErrorBoundary } from "./AppErrorBoundary"

export class ReactErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <AppErrorBoundary error={this.state.error} />
    }

    return this.props.children
  }
}
