
const BORDERS = /^[┃┆┊┇┋╎╏║━─·•\*┒┓┕┛┗┚┍┎┏┐┑┒┓└┕┗┖┘┙┛┚├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋\s\|_\-\.=+:\*]+$/;

export function isJunkLine(line: string, userMsg: string = ""): boolean {
  const l = line.trim().toLowerCase();
  if (!l) return true;
  if (BORDERS.test(l)) return true;
  if (l === userMsg.toLowerCase() || l.startsWith('> ' + userMsg.toLowerCase())) return true;
  if (/^[a-z0-9_-]+@[a-z0-9_-]+:.*?[\$#]/i.test(l)) return true;
  
  const noise = ['waiting for', 'logged in with', 'mcp error', '━━━━', '───', 'gemini.md files', 'type your message', 'gemini >', '/model', 'gemini'];
  if (noise.some(n => l.includes(n))) return true;
  if (line.includes('█') || line.includes('▀') || line.includes('▄') || line.includes('░')) return true;
  return line.trim().length > 10 && /^[^a-zA-Z0-9]+$/.test(line.trim());
}

export function filterGeminiContent(text: string, userMsg: string = "") {
  return text.split('\n').filter(line => !isJunkLine(line, userMsg)).join('\n').trim();
}
