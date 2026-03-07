
import React from "react";

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  
  componentDidCatch(error: any, errorInfo: any) {
    
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600 font-mono bg-panel-bg h-screen overflow-auto">
          <h1 className="text-xl font-black mb-4 uppercase tracking-widest">Application Crash</h1>
          <pre className="text-[10px] whitespace-pre-wrap">{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-black text-white text-[10px] font-black rounded-lg">RELOAD</button>
        </div>
      );
    }
    return this.props.children;
  }
}
