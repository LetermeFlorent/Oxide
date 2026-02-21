<div align="center">

<img src="public/tauri.svg" width="80" height="80" alt="Oxide Logo" />

# Oxide
### A High-Performance, Elegant Workspace for Modern Developers

[![Version](https://img.shields.io/github/v/release/LetermeFlorent/Oxide?style=for-the-badge&color=6366f1)](https://github.com/LetermeFlorent/Oxide/releases)
[![Tauri](https://img.shields.io/badge/Tauri-v2-black?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19-black?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-black?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<br />

<img src="screenshot.png" alt="Oxide Workspace" width="100%" style="border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />

<br />

## 🌟 Overview

**Oxide** is a next-generation developer environment designed for speed and beauty.  
Built with **Tauri v2** and **React 19**, it combines the flexibility of modern web technologies with the raw performance of **Rust**. 

It features a stunning **Glassmorphism** interface and a real **PTY-based terminal**,  
providing a seamless multi-project experience in a single, lightweight application.

<br />

## 🚀 Key Features

**Native Terminal (PTY)**  
Real Bash/Shell execution via Rust backend for maximum throughput.

**Glassmorphism UI**  
A modern, translucent interface with fluid Framer Motion animations.

**Multi-Project Support**  
Manage multiple workspaces simultaneously with persistent state.

**Integrated Viewers**  
High-performance rendering for Code (Monaco), Markdown, PDF, and Images.

**Smart Persistence**  
Optimized state management via Zustand and local file system synchronization.

<br />

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4  
**Backend:** Rust, Tauri v2 (PTY Management, File System)  
**Libraries:** Lucide Icons, Framer Motion, Monaco Editor, Xterm.js, Zustand

<br />

---

## 💻 Installation Guide

Follow these steps to set up Oxide on your local machine.

</div>

### 1. Prerequisites
Ensure you have the following installed:
- **Rust Toolchain**: [rust-lang.org](https://www.rust-lang.org/tools/install)
- **Node.js**: v20 or higher
- **System Dependencies**: Please refer to the [Tauri Setup Guide](https://tauri.app/v2/guides/getting-started/prerequisites) for your OS (Linux, macOS, or Windows).

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/LetermeFlorent/Oxide.git

# Navigate to the project directory
cd Oxide

# Install dependencies
npm install
```

### 3. Development
Launch the application in development mode with hot-reloading:
```bash
npm run tauri dev
```

### 4. Build for Production
Generate a native installer for your platform:
```bash
npm run tauri build
```

<div align="center">

<br />

---

Built with ❤️ by [LetermeFlorent](https://github.com/LetermeFlorent)

</div>
