class Plugin{
    constructor(){
        this.meta = {
            id: 'author.plugin-id',
            name: 'Название плагина',
            version: '1.0.0',
            author: 'Автор плагина',
            require: []
        }
    }

    load(){
        //...
    }

    loadBrush(brush){
        window.Bitmapper.brushes[(new brush()).meta.id] = brush
    }
}
