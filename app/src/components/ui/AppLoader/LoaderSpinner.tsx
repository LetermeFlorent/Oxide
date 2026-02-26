
import { memo } from "react";

export const LoaderSpinner = memo(() => (
  <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.8)' }}>
    <div className="loader-spin" style={{ width: '32px', height: '32px', border: '2px solid #000000', borderTopColor: 'transparent', borderRadius: '50%' }} />
  </div>
));

LoaderSpinner.displayName = 'LoaderSpinner';
