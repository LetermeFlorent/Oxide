use wasmtime::*;
use wasmtime_wasi::{WasiCtxBuilder, p1::add_to_linker_sync};
use std::path::Path;

pub struct PluginEngine { engine: Engine }

impl PluginEngine {
    pub fn new() -> Self {
        let mut config = Config::new(); config.async_support(false);
        Self { engine: Engine::new(&config).unwrap() }
    }

    pub fn run(&self, wasm_path: &Path, func_name: &str) -> Result<String, String> {
        let module = Module::from_file(&self.engine, wasm_path).map_err(|e| e.to_string())?;
        let mut linker = Linker::new(&self.engine);
        add_to_linker_sync(&mut linker, |t| t).map_err(|e| e.to_string())?;
        let wasi = WasiCtxBuilder::new().inherit_stdout().inherit_stderr().build_p1();
        let mut store = Store::new(&self.engine, wasi);
        let inst = linker.instantiate(&mut store, &module).map_err(|e| e.to_string())?;
        let func = inst.get_typed_func::<(), ()>(&mut store, func_name).map_err(|e| e.to_string())?;
        func.call(&mut store, ()).map_err(|e| e.to_string())?;
        Ok("Plugin executed".to_string())
    }
}

#[tauri::command]
pub async fn execute_wasm_plugin(path: String, func: String) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        PluginEngine::new().run(Path::new(&path), &func)
    }).await.map_err(|e| e.to_string())?
}
