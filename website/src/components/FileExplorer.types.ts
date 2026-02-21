/**
 * Project: Oxide Website
 * Responsibility: GitHub API Item Type Definitions
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
export interface GitHubItem {
  name: string;
  path: string;
  type: "dir" | "file";
  html_url: string;
}
