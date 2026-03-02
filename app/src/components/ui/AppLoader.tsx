
import { LoaderSpinner, LoaderBranding } from "./AppLoader/index";

export function AppLoader({ show, message = "Loading..." }: { show: boolean, message?: string }) {
  if (!show) return null;
  return (
    <div data-tauri-drag-region style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', fontFamily: 'system-ui, sans-serif', cursor: 'default' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', pointerEvents: 'none' }}>
        <LoaderSpinner /><LoaderBranding message={message} />
      </div>
    </div>
  );
}
