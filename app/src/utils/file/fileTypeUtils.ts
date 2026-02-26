
export const BINARY_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf'];

export function getFileExtension(name: string): string {
  if (!name.includes('.')) return '';
  return name.split('.').pop()?.toLowerCase() || '';
}

export function isBinaryFile(name: string): boolean {
  if (name.startsWith('.')) return false;
  return BINARY_EXTENSIONS.includes(getFileExtension(name));
}

export function isPdf(name: string): boolean {
  return getFileExtension(name) === 'pdf';
}
