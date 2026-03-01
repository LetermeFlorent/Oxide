
import { FileEntry } from "../../store/config/types";

const decoder = new TextDecoder();

function parseSubNode(buf: Uint8Array, v: DataView, s: { off: number }): FileEntry {
  const isFolder = buf[s.off++] === 1;
  const nLen = v.getUint32(s.off, true); s.off += 4;
  const pLen = v.getUint32(s.off, true); s.off += 4;
  const cCount = v.getUint32(s.off, true); s.off += 4;
  const name = decoder.decode(buf.subarray(s.off, s.off + nLen)); s.off += nLen;
  const path = decoder.decode(buf.subarray(s.off, s.off + pLen)); s.off += pLen;
  const node: FileEntry = { name, path, isFolder };
  if (isFolder) {
    node.children = [];
    for (let i = 0; i < cCount; i++) node.children.push(parseSubNode(buf, v, s));
  }
  return node;
}

export function parseBinaryTree(bin: Uint8Array) {
  const v = new DataView(bin.buffer, bin.byteOffset, bin.byteLength);
  const s = { off: 0 };
  const tCount = v.getUint32(s.off, true); s.off += 4;
  const tree: FileEntry[] = [];
  for (let i = 0; i < tCount; i++) tree.push(parseSubNode(bin, v, s));
  const iCount = v.getUint32(s.off, true); s.off += 4;
  const images: FileEntry[] = [];
  for (let i = 0; i < iCount; i++) images.push(parseSubNode(bin, v, s));
  return { tree, images };
}
