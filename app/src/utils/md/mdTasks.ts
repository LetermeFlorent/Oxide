
export function calculateTaskProgress(content: string): number | null {
  const lines = content.split('\n');
  let total = 0, done = 0;
  const taskRegex = /^(\s*([-*+]|\d+\.)\s+\[)( |x|X)(\].*)$/i;
  const doneRegex = /^(\s*([-*+]|\d+\.)\s+\[)(x|X)(\].*)$/i;
  
  for (const line of lines) {
    if (taskRegex.test(line)) { 
      total++; 
      if (doneRegex.test(line)) done++; 
    }
  }
  return total === 0 ? null : Math.round((done / total) * 100);
}

export function hasTasks(content: string): boolean {
  return /^(\s*([-*+]|\d+\.)\s+\[)( |x|X)(\].*)$/mi.test(content);
}

export function toggleTaskAtIndex(content: string, targetIndex: number): string {
  const lines = content.split('\n');
  let currentTaskIndex = 0;
  // Support -, *, + and numbered lists like 1. [ ]
  const taskRegex = /^(\s*([-*+]|\d+\.)\s+\[)( |x|X)(\].*)$/i;

  const newLines = lines.map(line => {
    const match = line.match(taskRegex);
    if (match) {
      if (currentTaskIndex === targetIndex) {
        const currentStatus = match[3].toLowerCase();
        const newStatus = currentStatus === 'x' ? ' ' : 'x';
        currentTaskIndex++;
        return `${match[1]}${newStatus}${match[4]}`;
      }
      currentTaskIndex++;
    }
    return line;
  });

  return newLines.join('\n');
}
