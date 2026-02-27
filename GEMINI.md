# Oxide - AI Developer Context

Oxide is a high-performance, elegant developer environment built with **Tauri v2**, **React 19**, and **Rust**. It features a glassmorphism UI, a real PTY-based terminal, and advanced file management capabilities using SQLite and LSM (Sled) for indexing.

## 🏗️ Architecture Overview

- **Monorepo Structure**: The project is organized into two main workspaces:
  - `/app`: The core Tauri application (Rust + React).
  - `/website`: The marketing landing page (React + Vite).
- **Build Delegation**: A root `package.json` manages global scripts and deployment delegation. For deployment platforms like Cloudflare Pages, use `npm run build` at the root, which delegates to the website and copies the output to a root `dist/` folder.

- **Frontend (`/app/src`)**: React 19 + Vite + TypeScript + Tailwind CSS v4.
  - **i18n**: Uses a custom `t` helper with split `en.json`/`fr.json` files in `src/i18n/`.
  - **State Management**: Zustand (located in `app/src/store`).
  - **Folder Rule**: Max 5 files per folder. Feature-based nesting is required.

## 🛠️ Key Commands

All application development commands should be run from the `/app` directory:

| Task | Command |
| :--- | :--- |
| **Development** | `npm run tauri dev` |
| **Build (Release)** | `npm run tauri build` |
| **Frontend Only** | `npm run dev` |
| **Type Check** | `npm run build` (runs `tsc`) |

## 📏 Development Conventions (O.A.S. Standards)

This project follows the **Optimization & Quality (O.A.S.)** standards. Adherence is mandatory for all contributions.

- **Zero-Bloat**: Prefer native solutions over external libraries.
- **STRICT File Limit**: Maximum **5 files per folder**. Create sub-directories to group logic if this limit is reached.
- **File Length Limit**: STRICT **50-line limit** per file. Modularize immediately (Extract Component/Method).
- **Naming**: Explicit and descriptive. No single-letter variables. Code and comments MUST be in **English**.
- **Localization**: No hardcoded UI strings. Use the i18n system.
- **Terminal Stability**: Manage `XTerm` instances with `useState` to sync hooks. Use `\n` for commands and a 100ms sync delay to prevent prompt flicker.
- **Explorer Performance**: NEVER clear the tree during refresh. Use `mergeTrees` to surgically update changed nodes while preserving folder expansion state. 
- **Surgical Watcher**: Implement a minimum 2s debounce and strict path filtering (path.startsWith(projectRoot)) for file system events to prevent sibling folders from appearing and avoid UI flickering.

## 📂 Directory Structure

- `/app/src/components`: UI components organized by feature (layout, panels, ui).
- `/app/src/hooks`: Custom React hooks for file operations, lifecycle, and UI logic.
- `/app/src/store`: Zustand state definitions.
- `/app/src-tauri/src`: Rust backend implementation modules.
- `/oxide-skill`: Specialized AI skill for this project.

---

*Note: This file is used by Gemini CLI to understand the project context and enforce standards.*
