---
name: oxide
description: Specialized skill for the Oxide project following O.A.S. standards (Zero-Bloat, 50-line limit, MS-RSL License, TDD, Localization). Use when working on the Oxide codebase (Tauri + React).
---

# Oxide - O.A.S. Development Standards

This skill enforces the O.A.S. (Optimization & Quality) standards for the Oxide project.

## 🏗️ Architecture & Structure
- **Package by Feature:** Organize code by business modules (`Explorer/`, `Terminal/`, `Editor/`).
- **Encapsulation:** Keep internals private. Only expose via public API, index, or entry point.
- **File Length:** STRICT 50-line limit per file. Modularize immediately.
- **Terminal Reactivity:** Manage `XTerm` instances with `useState` to sync hooks. Use `\n` for commands and a 100ms sync delay.
- **Explorer Sync:** Use `mergeTrees` for non-destructive updates. NEVER clear the tree (`[]`) during refresh.
- **Watcher Rules:** Minimum 2s debounce. Strict path filtering (`path.startsWith(projectRoot)`) is mandatory.

## ⚖️ Licensing & Headers (Mandatory)
Every file MUST include the standard MS-RSL license header.

**Code (.tsx/.ts/.rs/.js/.py):**
```text
/**
 * Project: Oxide
 * Responsibility: [Component/Module Responsibility]
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 * See root LICENSE for full terms.
 */
```

## 🛠️ Implementation Mindset
- **Naming:** Explicit, no single-letter names. All code/comments MUST be in **English**.
- **Catch Blocks:** NEVER empty. Log or handle properly.
- **Zero-Bloat:** Native over library. Minimize external dependencies.
- **Localization:** No Hardcoding. Strings MUST be in `i18n/*.json`.
  - **Standard:** Use a `t` helper function and split translations into `en.json` and `fr.json`.

## 🛡️ Security & Performance
- **No Secrets:** Never hardcode API keys or credentials.
- **Performance:** Optimize for memory and CPU. Minimize React re-renders.

## 🚀 Deployment (Cloudflare/Vercel)
- **Monorepo Strategy:** Use a root `package.json` to delegate build commands to the correct folder.
- **Build Redirection:** If the deployment platform expects a `dist` folder at the root, copy the nested build output (e.g., `website/dist`) to the project root after compilation:
  - `npm run build --prefix website && cp -r website/dist ./dist`
