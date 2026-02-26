
import { useState, useCallback, useMemo } from "react";
import { Search, Loader2, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../store/useStore";
import { safeKey } from "../../utils/ui/keyUtils";

export const SearchPanel = ({ onFileClick }: { onFileClick: (f: any) => void }) => {
  const { projects } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ case_sensitive: false, use_regex: false, whole_word: false });

  const handleSearch = async () => {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const paths = projects.map(p => p.id);
      const res = await invoke<any[]>("search_in_projects", { paths, query, options });
      setResults(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, any[]> = {};
    results.forEach(r => {
      if (!groups[r.path]) groups[r.path] = [];
      groups[r.path].push(r);
    });
    return Object.entries(groups).map(([path, items]) => ({ path, items }));
  }, [results]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f9f9f9] select-none">
      <div className="p-3 border-b border-gray-100 flex flex-col gap-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search..." className="w-full pl-8 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold outline-none focus:border-black/30" />
          {loading && <Loader2 size={10} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-modern-thin p-2 flex flex-col gap-1">
        {groupedResults.map((group, idx) => (
          <SearchResultGroup key={idx} group={group} onFileClick={onFileClick} />
        ))}
      </div>
    </div>
  );
};

const SearchResultGroup = ({ group, onFileClick }: any) => {
  const [expanded, setExpanded] = useState(true);
  const fileName = group.path.split('/').pop();
  return (
    <div className="flex flex-col">
      <div onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 px-2 py-1 hover:bg-black/5 rounded cursor-pointer transition-colors">
        {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        <FileText size={10} className="text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-tight truncate">{fileName}</span>
        <span className="text-[9px] text-gray-400 ml-auto">{group.items.length}</span>
      </div>
      {expanded && group.items.map((item: any, i: number) => (
        <div key={i} onClick={() => onFileClick({ path: item.path, name: fileName, line: item.line })} className="pl-6 pr-2 py-1 hover:bg-black/5 rounded cursor-pointer group flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-gray-400 font-mono">Line {item.line}</span>
          </div>
          <p className="text-[10px] text-gray-600 font-mono truncate opacity-80 group-hover:opacity-100">{item.content}</p>
        </div>
      ))}
    </div>
  );
};
