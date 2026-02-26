
import { LoaderSpinner, LoaderBranding } from "./AppLoader/index";

export function AppLoader({ show, message = "Loading..." }: { show: boolean, message?: string }) {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <LoaderSpinner /><LoaderBranding message={message} />
      </div>
    </div>
  );
}
