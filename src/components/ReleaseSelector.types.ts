/**
 * Project: Oxide Website
 * Responsibility: Release Type Definitions
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 * See root LICENSE for full terms.
 */
export interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  assets: {
    name: string;
    browser_download_url: string;
    size: number;
  }[];
  html_url: string;
}
