/**
 * @file AppLoader.tsx
 * @description Full-screen loading overlay displayed during app initialization
 * Shows branding and loading status with animated spinner
 *
 * Features:
 * - Centered branding with animated spinner
 * - Customizable loading message
 * - Fixed positioning over entire viewport
 * - Smooth fade-out transition support
 *
 * @component AppLoader
 */

/**
 * Props for the AppLoader component
 * @interface AppLoaderProps
 */
interface AppLoaderProps {
  /** Whether to show the loader */
  show: boolean;
  /** Optional loading message to display */
  message?: string;
}

/**
 * AppLoader Component
 *
 * Displays a full-screen loading overlay with Oxide AI branding
 * and an animated spinner while the application initializes.
 *
 * @param props - Component props
 * @returns The loading overlay or null if show is false
 */
export function AppLoader({ show, message = "Loading..." }: AppLoaderProps) {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f3f3',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'white',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <div className="loader-spin" style={{
            width: '32px',
            height: '32px',
            border: '2px solid #4f46e5',
            borderTopColor: 'transparent',
            borderRadius: '50%'
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#1f2937' }}>Oxide AI</span>
          <span style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#9ca3af' }}>{message}</span>
        </div>
      </div>
    </div>
  );
}
