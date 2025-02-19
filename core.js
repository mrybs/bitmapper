let createProjectForm = [
    {
        type: 'text_input',
        id: 'project_name',
        label: 'Название',
        value: 'Безымянный'
    },
    {
        type: 'number_input',
        id: 'image_width',
        label: 'Ширина',
        value: '32'
    },
    {
        type: 'number_input',
        id: 'image_height',
        label: 'Высота',
        value: '32'
    },
    {
        type: 'fieldset',
        label: 'Глубина цвета',
        inputs: [
            {
                type: 'radio',
                name: 'color_depth',
                id: '1bit',
                checked: false,
                label: '1 бит'
            },
            {
                type: 'radio',
                name: 'color_depth',
                id: '1bitinv',
                checked: false,
                label: '1 бит инвертировано'
            },
            {
                type: 'radio',
                name: 'color_depth',
                id: '8bit',
                checked: false,
                label: '8 бит - 323'
            },
            {
                type: 'radio',
                name: 'color_depth',
                id: '16bit',
                checked: false,
                label: '16 бит - 565'
            },
            {
                type: 'radio',
                name: 'color_depth',
                id: '24bit',
                checked: true,
                label: '24 бит'
            },
            {
                type: 'radio',
                name: 'color_depth',
                id: '248bit',
                checked: false,
                label: '24 бита + 8 бит'
            },
            {
                type: 'radio',
                name: 'color_depth',
                id: '824bit',
                checked: false,
                label: '8 бит + 24 бита'
            },
        ]
    }
]

let popup = new Popup(document.getElementsByTagName('body')[0], document.getElementById('workspace'), createProjectForm)
