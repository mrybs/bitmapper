let createProjectForm = {
    title: 'Создание проекта',
    inputs: [
        {
            type: 'text_input',
            id: 'project_name',
            label: 'Название',
            value: 'Безымянный'
        },
        {
            type: 'number_input',
            id: 'image_width',
            label: 'Ширина холста',
            value: '256'
        },
        {
            type: 'number_input',
            id: 'image_height',
            label: 'Высота холста',
            value: '256'
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
    ],
    actionButtons: [
        {
            'id': 'create_project_button',
            'label': 'Создать',
            'action': (event, popup) => {
                let projectSettings = popup.getValues()
                console.log(projectSettings)
                window.canvas = new Canvas(projectSettings)
                document.title = projectSettings.project_name + ' — Bitmapper'
                document.getElementById('show_grid').addEventListener('input', () => {
                    window.canvas.render()
                })
                window.canvas.render()
                popup.close()

                if(window.location.hash === '#dev') {
                    let _start = Date.now() / 1000
                    for (let i = 0; i < 60; i++) window.canvas.render()
                    let _cvsfps = 60 / (Date.now() / 1000 - _start)

                    _start = Date.now() / 1000
                    for (let i = 0; i < 60; i++) colorPickerRender()
                    let _cpfps = 60 / (Date.now() / 1000 - _start)

                    alert(`${_cvsfps} fps у рабочей области\n${_cpfps} fps у инструмента выбора цвета`)

                    let statusbar = document.getElementById('statusbar')
                    statusbar.innerHTML += '<span>Development mode</span>'
                }
            }
        }
    ]
}

let popup = new Popup(document.getElementsByTagName('body')[0], document.getElementById('workspace'), createProjectForm)

let plugins = [
    new Plugin()
]
plugins.forEach(plugin => {
    plugin.load()
    console.info(`Плагин ${plugin.meta.name} успешно загружен`)
})

colorPickerRender()