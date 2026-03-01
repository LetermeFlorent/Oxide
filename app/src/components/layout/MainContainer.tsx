
import { useStore } from "../../store/useStore";
import { ProjectTabs } from "./ProjectTabs";
import { MainLayout } from "./MainLayout";
import { GlobalModals } from "../ui/GlobalModals";
import { useFolderManagement } from "../../hooks/file/useFolderManagement";

interface MainContainerProps { appReady: boolean; onFile: (path: string, content: string) => void; }

export const MainContainer = ({ appReady, onFile }: MainContainerProps) => {
  const { openFolder } = useFolderManagement();
  const { compactMode, verticalTabs, projects, showSettings } = useStore();
  const showTabs = !verticalTabs && (projects.length > 0 || !!showSettings);

  return (
    <div className={`h-screen w-screen bg-[#f3f3f3] overflow-hidden flex flex-col select-none transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 flex flex-col" style={{ padding: compactMode ? '0' : '8px', gap: compactMode ? '0' : '8px' }}>
        {showTabs && <ProjectTabs onOpen={() => openFolder('add')} />}
        <MainLayout onOpen={() => openFolder('add')} onOpenFolder={() => openFolder('replace')} onFile={onFile} />
      </div>
      <GlobalModals />
    </div>
  );
};
