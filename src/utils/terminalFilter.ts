/**
 * @file terminalFilter.ts
 * @description Terminal output filtering utilities for cleaning up noisy content
 * Removes ANSI codes, decorative borders, and CLI noise (especially from Gemini CLI)
 *
 * Features:
 * - ANSI escape sequence stripping
 * - Decorative border/line removal
 * - Gemini CLI noise filtering
 * - User input echo removal
 *
 * @module utils/terminalFilter
 */

/**
 * Strips ANSI escape sequences from terminal output
 * Removes color codes, cursor movements, and other control sequences
 *
 * @param str - String containing ANSI codes
 * @returns Clean string with ANSI codes removed
 */
export const stripAnsi = (str: string) => {
  return str
    .replace(/\x1b\][0-9;]*.*?(?:\x07|\x1b\\)/g, '')
    .replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '')
    .replace(/\x1b[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
};

/**
 * Determines if a terminal line is "junk" that should be filtered out
 * Filters decorative borders, prompts, CLI noise, and empty lines
 *
 * @param line - The terminal line to evaluate
 * @param userMsg - Optional user message to filter out echoes
 * @returns True if the line should be filtered out
 */
export const isJunkLine = (line: string, userMsg: string = "") => {
  const trimmed = line.trim();
  const l = trimmed.toLowerCase();
  if (!l) return true;
  // Decorative borders and frames
  if (/^[┃┆┊┇┋╎╏║━─·•\*┒┓┕┛┗┚┍┎┏┐┑┒┓└┕┗┖┘┙┛┚├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋\s\|_\-\.=+:\*]+$/.test(l)) return true;
  // Echoes and prompts
  if (l === userMsg.toLowerCase() || l.startsWith('> ' + userMsg.toLowerCase())) return true;
  if (/^[a-z0-9_-]+@[a-z0-9_-]+:.*?[\$#]/i.test(l)) return true;
  // Gemini CLI noise
  if (l.includes('waiting for') || l.includes('logged in with') || l.includes('mcp error')) return true;
  if (l.includes('━━━━') || l.includes('───') || l.includes('gemini.md files')) return true;
  if (l.includes('type your message') || l.includes('gemini >') || l.includes('/model')) return true;
  if (l === 'gemini') return true;
  // Black separation lines or fill blocks
  if (trimmed.includes('█') || trimmed.includes('▀') || trimmed.includes('▄') || trimmed.includes('░')) return true;
  if (trimmed.length > 10 && /^[^a-zA-Z0-9]+$/.test(trimmed)) return true;

  return false;
};

/**
 * Filters Gemini CLI output to remove noise and decorative elements
 * Returns clean content suitable for display
 *
 * @param text - Raw terminal output text
 * @param userMsg - Optional user message to filter echoes
 * @returns Clean filtered text
 */
export const filterGeminiContent = (text: string, userMsg: string = "") => {
  return text.split('\n')
    .filter(line => !isJunkLine(line, userMsg))
    .join('\n').trim();
};
