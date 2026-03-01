import { useEffect } from "react";
import { useStore } from "../../store/useStore";
import { calculateTaskProgress } from "../../utils/md/mdUtils";
import { monitoredInvoke } from "../../utils/performance/monitoredInvoke";

/**
 * Hook to automatically synchronize and calculate progress for followed files.
 * Ensures that if a project has a followed file, its progress is up-to-date
 * even after app restart or hydration.
 */
export function useFollowedFileSync() {
  const projects = useStore(s => s.projects);
  const updateProject = useStore(s => s.updateProject);
  const hydrated = useStore(s => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    projects.forEach(async (project) => {
      // If we have a followed file but NO progress (null), we need to calculate it
      if (project.followedFilePath && project.taskProgress === null) {
        try {
          // Check if file exists and get content via Rust command
          const content = await monitoredInvoke<string>("read_text_file", { path: project.followedFilePath });
          const progress = calculateTaskProgress(content);
          
          updateProject(project.id, { taskProgress: progress });
        } catch (e) {
          // Progress restoration failed
        }
      }
    });
  }, [hydrated, projects.length, updateProject]); // Only run on hydration or when project list size changes
}
