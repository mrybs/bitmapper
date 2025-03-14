class BadPlugin extends Plugin{
    constructor(){
        super()
        this.meta = {
            id: 'mrybs.bad-plugin',
            name: 'Плохой плагин',
            version: '1.0.0',
            author: 'Mr. Ybs',
            require: []
        }
    }
    load(){
        throw new Error()
    }
}
