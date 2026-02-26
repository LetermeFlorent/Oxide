
pub fn is_ignored(name: &str) -> bool {
    matches!(name, "node_modules" | ".git" | "target" | "dist" | "build" | ".next" | ".svelte-kit")
}

pub fn is_image(name: &str) -> bool {
    let lower = name.to_lowercase();
    [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]
        .iter()
        .any(|&e| lower.ends_with(e))
}
