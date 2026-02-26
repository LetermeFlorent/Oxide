
import { memo } from "react";

export const LoaderBranding = memo(({ message }: { message: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#1f2937', marginRight: '-0.3em', lineHeight: '1' }}>Oxide AI</span>
    <span style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', color: '#9ca3af', height: '12px', lineHeight: '12px' }}>{message}</span>
  </div>
));

LoaderBranding.displayName = 'LoaderBranding';
