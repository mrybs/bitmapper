function initPlugin(plugin){
    try{
        let p = new plugin()
        window.Bitmapper.plugins[p.meta.id] = p
    }catch(e){
        console.info(`При инициализации плагина ${plugin} произошла ошибка:\n${e}`)
    }
}
function loadPlugins(){
    let ids = []
    Object.keys(window.Bitmapper.plugins).forEach(key => {
        let plugin = window.Bitmapper.plugins[key]
        try{
            plugin.load()
            console.info(`Плагин ${plugin.meta.name} успешно загружен`)
            window.Bitmapper.devtools.successfully_loaded_plugins.innerHTML += `<span class="devtools-plugin-load-succeed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
        }catch(e){
            console.info(`При загрузке плагина ${plugin.meta.name} произошла ошибка:\n${e}`)
            window.Bitmapper.devtools.failed_to_load_plugins.innerHTML += `<span class="devtools-plugin-load-failed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
        }

    })
}