# Changelog

## [1.1.7] - 2026-02-22

### Fixed
- Fixed terminal freezing and responsiveness issues after view/tab switching.
- Resolved input lag and display synchronization in Terminal Overviews (Grid view).
- Fixed background PTY visibility management to ensure data is received in all views.
- Separated Terminal Overview PTY instances from main project terminals to prevent interference.

### Changed
- Improved terminal header UI: now displays the project path in bold next to "Terminal".
- Simplified terminal shell prompt to a clean `>`.
- Refactored `useTerminal` hook for more robust visibility and focus handling.
- Optimized terminal status updates to prevent "Loading..." spinner interference between views.
