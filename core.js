window.Bitmapper = {
    devtools: {
        enabled: document.location.hash.split('#').includes('dev'),
        devtools: document.getElementById('devtools'),
        successfully_loaded_plugins: document.getElementById('devtools-successfully-loaded-plugins'),
        failed_to_load_plugins: document.getElementById('devtools-failed-to-load-plugins'),
        cursor_position: document.getElementById('devtools-cursor-position'),
        canvas_size: document.getElementById('devtools-canvas-size')
    }
}

if(window.Bitmapper.devtools.enabled){
    window.Bitmapper.devtools.devtools.style.transform = 'translateX(0%)'
}
else{
    window.Bitmapper.devtools.devtools.style.transform = 'translateX(100%)'
}

let tab_factory = new TabFactory(document.getElementById('tabs'), document.getElementById('root'))
tab_factory.createTab()

let plugins = [
    new Plugin(),
    new BadPlugin()
]
window.Bitmapper.devtools.successfully_loaded_plugins.innerHTML = `
<span class="devtools-sector-header">Загруженные плагины</span><br>
`
window.Bitmapper.devtools.failed_to_load_plugins.innerHTML = `
<span class="devtools-sector-header">Проблемные плагины</span><br>
`

plugins.forEach(plugin => {
    try{
        plugin.load()
        console.info(`Плагин ${plugin.meta.name} успешно загружен`)
        window.Bitmapper.devtools.successfully_loaded_plugins.innerHTML += `<span class="devtools-plugin-load-succeed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
    }catch(e){
        console.info(`При загрузке плагина ${plugin.meta.name} произошла ошибка:\n${e}`)
        window.Bitmapper.devtools.failed_to_load_plugins.innerHTML += `<span class="devtools-plugin-load-failed">${plugin.meta.name} ${plugin.meta.version}</span><br>`
    }

})

document.addEventListener("keypress", (event) => {
    if(event.code === "BracketRight"){
        window.Bitmapper.devtools.enabled = !window.Bitmapper.devtools.enabled
        if(window.Bitmapper.devtools.enabled){
            window.Bitmapper.devtools.devtools.style.transform = 'translateX(0%)'
        }
        else{
            window.Bitmapper.devtools.devtools.style.transform = 'translateX(100%)'
        }
    }
});
