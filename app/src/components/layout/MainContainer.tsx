
import { useStore } from "../../store/useStore";
import { ProjectTabs } from "./ProjectTabs";
import { MainLayout } from "./MainLayout";
import { GlobalModals } from "../ui/GlobalModals";
import { WindowControls } from "../ui/WindowControls";
import { useFolderManagement } from "../../hooks/file/useFolderManagement";

interface MainContainerProps { appReady: boolean; onFile: (path: string, content: string) => void; }

export const MainContainer = ({ appReady, onFile }: MainContainerProps) => {
  const { openFolder } = useFolderManagement();
  const { compactMode, verticalTabs, projects, showSettings } = useStore();
  const showTabs = !verticalTabs && (projects.length > 0 || !!showSettings);

  return (
    <div data-tauri-drag-region className={`h-screen w-screen bg-[#f3f3f3] overflow-hidden flex flex-col select-none transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`} style={{ cursor: 'default' }}>
      <div className={`flex shrink-0 ${compactMode ? 'h-8' : 'h-10 mt-2 mx-2'}`} data-tauri-drag-region>
        <div className="flex-1 flex overflow-hidden min-w-0" data-tauri-drag-region>
          {showTabs && <ProjectTabs onOpen={() => openFolder('add')} />}
        </div>
        <WindowControls />
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ padding: compactMode ? '0' : '8px', pt: compactMode ? '0' : '0', gap: compactMode ? '0' : '8px' }}>
        <MainLayout onOpen={() => openFolder('add')} onOpenFolder={() => openFolder('replace')} onFile={onFile} />
      </div>
      <GlobalModals />
    </div>
  );
};
