function initPlugin(plugin){
    try{
        let p = new plugin()
        window.Bitmapper.plugins[p.meta.id] = p
    }catch(e){
        console.info(`При инициализации плагина ${plugin} произошла ошибка:\n${e}`)
    }
}
function loadPlugins(){
    Object.keys(window.Bitmapper.plugins).forEach(key => {
        let plugin = window.Bitmapper.plugins[key]
        try{
            let no_dependency = false
            plugin.meta.require.forEach((plugin_id) => {
                if(no_dependency) return null
                if(!Object.keys(window.Bitmapper.plugins).includes(plugin_id)){
                    console.info(`Плагин ${plugin.meta.name} ${plugin.meta.version} не может быть загружен, так как зависимость от плагина ${plugin_id} не удовлетворена`)
                    window.Bitmapper.devtools.failed_to_load_plugins.innerHTML += `<span class="devtools-plugin-no-dependency">${plugin.meta.name} ${plugin.meta.version}</span><br>`
                    no_dependency = true
                }else if(window.Bitmapper.plugins[plugin_id].meta.hasOwnProperty('failed_to_load') && window.Bitmapper.plugins[plugin_id].meta.failed_to_load){
                    console.info(`Плагин ${plugin.meta.name} ${plugin.meta.version} не может быть загружен, так как плагин-зависимость ${window.Bitmapper.plugins[plugin_id].meta.name} ${window.Bitmapper.plugins[plugin_id].meta.version} не был успешно загружен`)
                    window.Bitmapper.devtools.failed_to_load_plugins.innerHTML += `<span class="devtools-plugin-dependency-load-failed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
                    no_dependency = true
                }
            })
            if(no_dependency){
                plugin.meta.failed_to_load = true
                return null
            }
            plugin.load()
            console.info(`Плагин ${plugin.meta.name} ${plugin.meta.version} успешно загружен`)
            window.Bitmapper.devtools.successfully_loaded_plugins.innerHTML += `<span class="devtools-plugin-load-succeed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
        }catch(e){
            console.info(`При загрузке плагина ${plugin.meta.name} ${plugin.meta.version} произошла ошибка:\n${e}`)
            window.Bitmapper.devtools.failed_to_load_plugins.innerHTML += `<span class="devtools-plugin-load-failed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
            plugin.meta.failed_to_load = true
        }

    })
}
