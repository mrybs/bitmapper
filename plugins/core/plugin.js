class CorePlugin extends Plugin {
    constructor() {
        super();
        this.meta = {
            id: 'mrybs.core',
            name: 'CorePlugin',
            version: '0.0.1',
            author: 'Mr. Ybs',
            require: [
                'mrybs.tab-factory'
            ]
        }
    }

    load(){
        this.loadBrush(Brush)
        this.loadBrush(SquaredBrush)

        window.Bitmapper.tab_factory = new window.Bitmapper.plugins['mrybs.tab-factory'].TabFactory(document.getElementById('tabs'), document.getElementById('root'))
        window.Bitmapper.tab_factory.createTab()
    }
}
