
export function checkGeminiStatus(text: string): boolean | null {
  if (!text) return null;
  const analysis = text.length > 10000 ? text.substring(text.length - 10000) : text;
  const lower = analysis.toLowerCase();
  
  const startIdx = Math.max(
    lower.lastIndexOf('gemini >'), lower.lastIndexOf('type your message'),
    lower.lastIndexOf('gemini.md files'), lower.lastIndexOf('gemini code assist')
  );
  const endIdx = Math.max(
    lower.lastIndexOf('bye!'), lower.lastIndexOf('exiting gemini'),
    lower.lastIndexOf('goodbye'), lower.lastIndexOf('powering down'),
    lower.lastIndexOf('interaction summary'), lower.lastIndexOf('wall time')
  );

  if (startIdx !== -1 && startIdx > endIdx) return true;
  if (endIdx !== -1 && endIdx >= startIdx) return false;
  return null;
}
