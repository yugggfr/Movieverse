import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="text-6xl">🎬</div>
          <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
          <p className="text-gray-400 text-sm">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
