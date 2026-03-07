
import { memo } from "react";

export const ModalButton = memo(({ onClick, label, variant = 'secondary', disabled = false, className = "" }: any) => {
  const base = "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95";
  const styles: any = {
    primary: "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 disabled:opacity-30",
    secondary: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {label}
    </button>
  );
});

export const ModalInput = memo(({ value, onChange, onKeyDown, autoFocus = false }: any) => (
  <input 
    autoFocus={autoFocus}
    type="text" 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    onFocus={(e) => e.target.select()}
    onKeyDown={onKeyDown}
    className="w-full px-4 py-3.5 bg-sidebar-bg border border-border rounded-2xl text-[12px] font-bold text-gray-700 outline-none focus:border-black/20 focus:bg-panel-bg transition-all mb-5" 
  />
));

ModalButton.displayName = 'ModalButton';
ModalInput.displayName = 'ModalInput';
