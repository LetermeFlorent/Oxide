export interface GitHubItem {
  name: string;
  path: string;
  type: "dir" | "file";
  html_url: string;
}
