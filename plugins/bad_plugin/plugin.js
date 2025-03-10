class BadPlugin{
    constructor(){
        this.meta = {
            id: 'bad-plugin',
            name: 'Плохой плагин',
            version: '1.0.0',
            require: []
        }
    }
    load(){
        throw DOMException
    }
}