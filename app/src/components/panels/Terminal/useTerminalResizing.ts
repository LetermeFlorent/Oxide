
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export function useTerminalResizing(ptyId: string, ref: React.RefObject<HTMLDivElement | null>, term: XTerm | null, fit: FitAddon | null) {
  useEffect(() => {
    if (!ref.current || !term || !fit) return;
    const observer = new ResizeObserver(() => {
      if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
        fit.fit();
        if (term.rows > 0 && term.cols > 0) invoke("resize_pty", { id: ptyId, rows: term.rows, cols: term.cols }).catch(() => {});
        term.scrollToBottom();
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ptyId, ref, term, fit]);
}
