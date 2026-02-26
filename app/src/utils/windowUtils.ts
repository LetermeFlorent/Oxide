
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export const detachProject = async (projectId: string, projectName: string, viewMode?: string) => {
  const safeId = String(projectId || 'unknown').replace(/[^a-zA-Z0-9]/g, '-');
  const sessionId = `session-${Math.random().toString(36).substring(2, 9)}`;
  const label = `detached-${safeId}-${Math.random().toString(36).substring(2, 7)}`;
  
  let url = `index.html?projectId=${encodeURIComponent(projectId)}&sessionId=${sessionId}&projectName=${encodeURIComponent(projectName)}`;
  if (viewMode) url += `&viewMode=${encodeURIComponent(viewMode)}`;
  
  try {
    const webview = new WebviewWindow(label, {
      url,
      title: `Oxide - ${projectName || 'Detached'}`,
      width: 1200,
      height: 800,
      decorations: true,
      shadow: true,
      center: true,
    });

    webview.once('tauri://created', () => {
      // Window created successfully
    });

    webview.once('tauri://error', (e) => {
      // Error handled silently as per requirements (no logs)
    });

    return webview;
  } catch (err) {
    return null;
  }
};
