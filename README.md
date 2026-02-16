# 🌌 Oxide

<p align="center">
  <img src="screenshot.png" alt="Oxide UI" width="800px" style="border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.1);" />
</p>

<p align="center">
  <b>The Next-Gen Workspace for Modern Developers</b><br>
  <i>Fast, Minimalist, and Built with Tauri v2 + React 19</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-orange?style=for-the-badge" alt="Platform" />
  <img src="https://img.shields.io/github/license/LetermeFlorent/Oxide?style=for-the-badge" alt="License" />
</p>

---

## ✨ Features

- 🚀 **High Performance:** Built with Rust and Tauri v2 for a lightweight, native experience.
- 🎨 **Modern UI:** Beautiful glassmorphic design with smooth animations powered by Framer Motion.
- 🛠️ **Integrated PTY:** Real-time shell integration with Bash and terminal monitoring.
- 📁 **Multi-Project:** Manage multiple workspaces simultaneously with ease.
- 📄 **Content Rich:** Advanced rendering for Code (Monaco), Markdown, PDF, and Images.
- ✅ **Task Tracking:** Automatically detect and follow project progress via `task.md`.

## 🛠️ Tech Stack

- **Core:** [Tauri v2](https://tauri.app/), [Rust](https://www.rust-lang.org/)
- **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Terminal:** [xterm.js](http://xtermjs.org/)

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Rust Toolchain](https://rustup.rs/)
- [Tauri Dependencies](https://tauri.app/v1/guides/getting-started/prerequisites)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/LetermeFlorent/Oxide.git
   cd Oxide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run tauri dev
   ```

## 🏗️ Architecture

- `src/`: React frontend with customized workspace logic.
- `src-tauri/`: Rust backend handling PTY sessions and system-level operations.
- `.github/`: Automated CI/CD workflows for testing and releases.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  Created with ❤️ by <a href="https://github.com/LetermeFlorent">LetermeFlorent</a>
</p>
