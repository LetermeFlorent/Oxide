# Changelog

All notable changes to this project will be documented in this file.

## [1.1.2-beta] - 2026-02-21

### Fixed
- **Terminal Performance:** Removed artificial delays during terminal initialization for instant startup.
- **Terminal Persistence:** Implemented a backend output buffer (512KB) to preserve terminal state when switching between projects or panels.
- **Terminal Prompt:** Restored full path display by switching to interactive bash mode and removing the `PS1` override.
- **Terminal Connectivity:** Improved PTY re-attachment logic to prevent duplicate data rendering upon remounting.
