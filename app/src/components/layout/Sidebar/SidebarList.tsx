
import { memo } from "react";
import { TreeItem } from "../../panels/Explorer";
import { t } from "../../../i18n";
import { safeKey, isValidKey } from "../../../utils/ui/keyUtils";

const ITEM_HEIGHT = 28;

const getEntryKey = (projectId: string, entry: any, index: number): string => {
  const path = entry?.path;
  if (!path || typeof path !== 'string' || path.trim() === '') {
    
    return safeKey('tree', `invalid-${index}`, index);
  }
  return safeKey('tree', `${projectId}-${path}`, index);
};

export const SidebarList = memo(({ scrollRef, onScroll, height, visibleItems, onFileClick, projectId, isLoading, searchEmpty }: any) => (
  <div ref={scrollRef} onScroll={(e) => onScroll(e.currentTarget.scrollTop)} className="flex-1 overflow-auto relative scrollbar-modern min-h-0">
    <div style={{ height, width: '100%', position: 'relative' }}>
      {visibleItems.length === 0 && !isLoading && searchEmpty && (
         <div className="p-4 text-center text-[10px] text-gray-400 italic font-medium">{t('explorer.empty_project')}</div>
      )}
      {visibleItems.map(({ entry, level, index }: any) => (
        <div key={getEntryKey(projectId, entry, index)} style={{ position: 'absolute', top: index * ITEM_HEIGHT, height: ITEM_HEIGHT, width: '100%' }}>
          <TreeItem entry={entry} onClick={onFileClick} level={level} projectId={projectId} />
        </div>
      ))}
    </div>
  </div>
));

SidebarList.displayName = 'SidebarList';
