class TabFactory{
    constructor(tab_headers_root, workspace_root){
        this.tab_headers_root = tab_headers_root
        this.workspace_root = workspace_root
        this.tabs = []
    }
    createTabHeader(title, selected, onclick, onclose){
        let tab_header = document.createElement('div')
        tab_header.classList.add('tab-header')
        if(selected) tab_header.setAttribute('selected', 'true')
        tab_header.innerHTML = `
            <span class="tab-header-label">${title}</span>
            <span class="material-symbols-outlined tab-header-close">close_small</span>
        `
        tab_header.addEventListener('click', (event) => {
            onclick({
                title: title,
                tab_header: tab_header
            }, event)
        })
        tab_header.getElementsByClassName('tab-header-close')[0].addEventListener('click', (event) => {
            onclose({
                title: title,
                tab_header: tab_header
            }, event)
        })
        this.tab_headers_root.appendChild(tab_header)
        return tab_header
    }
    createTab(){
        let tab = document.createElement('div')
        let tab_header = null
        tab.classList.add('tab')
        tab.innerHTML = `
            <div class="workspace">
                <div class="toolpane">
                    <div>
                        <canvas class="colorpicker"></canvas>
                    </div>
                    <input class="colorpicker-hex-color" type="text" maxlength="9">
                    <div class="input-wrapper"><input type="checkbox" class="show_grid" id="show_grid"><label for="show_grid">Показать сетку</label></div>
                    <button class="save-button"><span class="material-symbols-outlined">file_export</span> <span class="button-label">Экспорт на устройство</span></button>
                    <span class="material-symbols-outlined hide-toolpane-btn">keyboard_double_arrow_up</span>
                </div>
                <canvas class="editor">
                    Ваш браузер не поддерживает Canvas. Работа редактора невозможна
                </canvas>
                <div class="navbar">
                    <span class="material-symbols-outlined navbar-home">home</span>
                </div>
            </div>
        `

        let elements = {
            workspace: tab.getElementsByClassName('workspace')[0],
            toolpane: tab.getElementsByClassName('toolpane')[0],
            colorpicker: tab.getElementsByClassName('colorpicker')[0],
            colorpicker_hex_color: tab.getElementsByClassName('colorpicker-hex-color')[0],
            show_grid: tab.getElementsByClassName('show_grid')[0],
            save_button: tab.getElementsByClassName('save-button')[0],
            hide_toolpane_btn: tab.getElementsByClassName('hide-toolpane-btn')[0],
            editor: tab.getElementsByClassName('editor')[0],
            navbar: tab.getElementsByClassName('navbar')[0],
            navbar_home: tab.getElementsByClassName('navbar-home')[0]
        }
        let tab_data = {
            toolpane: {
                hidden: false,
                colorpicker: null
            },
            editor: {
                canvas: null
            }
        }
        let data = {
            tab: tab,
            tab_header: tab_header,
            elements: elements,
            data: tab_data,
            select: () => {
                tab_header.setAttribute('selected', 'true')
                tab.style.display = 'block'
            },
            deselect: () => {
                tab_header.removeAttribute('selected')
                tab.style.display = 'none'
            }
        }
        
        tab_data.toolpane.colorpicker = new HSLColorPicker(elements.colorpicker, elements.colorpicker_hex_color)
        tab_data.toolpane.colorpicker.render()

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
                    id: 'create_project_button',
                    label: 'Создать',
                    action: (event, popup) => {
                        let projectSettings = popup.getValues()
                        console.log(projectSettings)
                        tab_data.editor.canvas = new Canvas(projectSettings, elements.editor, elements.save_button, tab_data.toolpane.colorpicker)
                        //document.title = projectSettings.project_name + ' — Bitmapper'
                        elements.show_grid.addEventListener('input', () => {
                            tab_data.editor.canvas.render()
                        })
                        tab_data.editor.canvas.render()
                        tab_header = this.createTabHeader(projectSettings.project_name, true, 
                        (tab_header, event) => {
                            this.deselectAll()
                            data.select()
                        },
                        (tab_header, event) => {
                            tab.remove()
                            tab_header.tab_header.remove()
                        })
                        this.deselectAll()
                        data.select()
                        popup.close()

                        if(window.location.hash.split('#').includes('benchmark')) {
                            let _start = Date.now() / 1000
                            for (let i = 0; i < 60; i++) window.canvas.render()
                            let _cvsfps = 60 / (Date.now() / 1000 - _start)

                            _start = Date.now() / 1000
                            for (let i = 0; i < 60; i++) tab_data.toolpane.colorpicker.render()
                            let _cpfps = 60 / (Date.now() / 1000 - _start)

                            alert(`${_cvsfps} fps у рабочей области\n${_cpfps} fps у инструмента выбора цвета`)
                        }
                    }
                }
            ]
        }
        let popup = new Popup(document.getElementsByTagName('body')[0], elements.workspace, createProjectForm)

        elements.hide_toolpane_btn.addEventListener('click', (event) => {
            tab_data.toolpane.hidden = !tab_data.toolpane.hidden
            if(tab_data.toolpane.hidden){
                elements.toolpane.style.transform = 'translateY(calc(3em - 100%)) translateX(-100%)'
                elements.hide_toolpane_btn.style.transform = 'rotate(180deg) translateX(-350px)'
            }else{
                elements.toolpane.style.transform = 'translateY(0)'
                elements.hide_toolpane_btn.style.transform = 'rotate(0)'
            }
        })

        elements.navbar_home.addEventListener('click', (event) => {
            tab_data.editor.canvas.zoom = 1
            tab_data.editor.canvas.canvasPosOffset = new Vector(0, 0)
            tab_data.editor.canvas.render()
        })

        this.workspace_root.appendChild(tab)
        this.tabs.push(data)
        return data
    }
    deselectAll(){
        this.tabs.forEach((tab) => {
            tab.deselect()
        })
    }
}