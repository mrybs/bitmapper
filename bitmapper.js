var ROOT = 'https://raw.githubusercontent.com/mrybs/bitmapper/refs/heads/master/'
//var ROOT = ''
var VERSION = 'Alpha 140325f'

function import_global_style(path){
    let link = document.createElement('link')
    link.href = path
    link.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(link);
}

function import_style(path){
    import_global_style(ROOT+path)
}

function import_styles(paths){
    paths.forEach(path => {
        import_style(path)
    })
}

function import_global_script(path){
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = path
    document.getElementsByTagName('body')[0].appendChild(script);
}

function import_script(path){
    import_global_script(ROOT+path)
}

function import_scripts(paths){
    paths.forEach(path => {
        import_script(path)
    })
}

function init_bitmapper(){
    document.getElementsByTagName('body')[0].innerHTML += `
        <div id="root">
            <div id="tabs"><button onclick="window.Bitmapper.tab_factory.createTab()" id="create-tab-btn">+</button></div>
            <div id="statusbar">
                ${VERSION}
                <a target="_blank" href="https://github.com/mrybs/bitmapper">GitHub</a>
                <a target="_blank" href="https://t.me/mrybspublicmatrixchat">Telegram</a>
            </div>
            <div id="devtools">
                <div id="devtools-successfully-loaded-plugins">
                    <span class="devtools-sector-header">Загруженные плагины</span><br>
                </div>
                <div id="devtools-failed-to-load-plugins">
                    <span class="devtools-sector-header">Проблемные плагины</span><br>
                </div><br>
                <div id="devtools-cursor-position"></div>
                <div id="devtools-canvas-size"></div>
            </div>
        </div>
    `
}

document.addEventListener('DOMContentLoaded', () => {
    window.title = 'Bitmapper'

    import_global_style('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=close_small,file_export,home,keyboard_double_arrow_up')

    import_styles([
        'styles/imports.css',
        'styles/pallete.css',
        'styles/inputs.css',
        'styles/styles.css',
        'plugins/core/styles/popup.css',
        'plugins/tab_factory/styles/tabs.css'
    ])

    init_bitmapper()

    import_scripts([
        'styles/vector.js',
        'plugins/plugin.js',
        'plugins/core/brushes/brush.js',
        'styles/globals.js',
        'plugins/bad_plugin/plugin.js',
        'plugins/core/brushes/squared.js',
        'plugins/core/plugin.js',
        'plugins/hsl_colorpicker/plugin.js',
        'plugins/canvas/plugin.js',
        'styles/plugin_loader.js',
        'plugins/core/popup.js',
        'plugins/tab_factory/plugin.js',
        'styles/devtools.js'
    ])

    let wait = setInterval(() => {
        try {
            initPlugin(Plugin)  // Плагин-пустышка
            initPlugin(BadPlugin)  // "Поломанный" плагин, вызывает ошибку при загрузке
            initPlugin(TabFactoryPlugin)
            initPlugin(HSLColorPickerPlugin)
            initPlugin(CanvasPlugin)
            initPlugin(CorePlugin)  // Главный плагин
            loadPlugins()
            clearInterval(wait)
        }catch(ReferenceError){
            //...
        }
    }, 1)
})
