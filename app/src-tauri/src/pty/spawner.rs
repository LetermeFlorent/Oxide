
use portable_pty::{CommandBuilder, PtySize, PtySystem, MasterPty, Child};
use std::path::Path;

pub fn create_pty(sys: &dyn PtySystem, r: u16, c: u16, cwd: Option<String>) -> Result<(Box<dyn MasterPty + Send>, Box<dyn Child + Send>), String> {
    let pair = sys.openpty(PtySize { rows: r, cols: c, pixel_width: 0, pixel_height: 0 }).map_err(|e| e.to_string())?;
    #[cfg(target_os = "windows")] let mut cmd = CommandBuilder::new("cmd.exe");
    #[cfg(not(target_os = "windows"))] let mut cmd = CommandBuilder::new("bash");
    #[cfg(not(target_os = "windows"))] { 
        cmd.arg("-i"); 
        cmd.env("TERM", "xterm-256color"); 
        cmd.env("PS1", "> ");
    }
    if let Some(p) = cwd { if Path::new(&p).exists() { cmd.cwd(p); } }
    let child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    Ok((pair.master, child))
}
