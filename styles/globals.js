window.Bitmapper = {
    plugins: {},
    brushes: {},
    flags: document.location.hash.split('#'),
    devtools: {
        enabled: document.location.hash.split('#').includes('dev'),
        devtools: document.getElementById('devtools'),
        successfully_loaded_plugins: document.getElementById('devtools-successfully-loaded-plugins'),
        failed_to_load_plugins: document.getElementById('devtools-failed-to-load-plugins'),
        cursor_position: document.getElementById('devtools-cursor-position'),
        canvas_size: document.getElementById('devtools-canvas-size')
    }
}
