class Popup{
    readForm(form){
        let html = ''
        form.forEach((e) => {
            switch(e.type){
                case 'text_input':
                    html += `<div class="input-wrapper"><label for="${e.id}">${e.label}</label><input type="text" id="${e.id}" value="${e.value}"></div>`
                    break
                case 'number_input':
                    html += `<div class="input-wrapper"><label for="${e.id}">${e.label}</label><input type="number" id="${e.id}" value="${e.value}"></div>`
                    break
                case 'radio':
                    html += `<input type="radio" id="${e.id}" name="${e.name}" ${e.checked ? "checked" : ""}/><label for="${e.id}">${e.label}</label><br>`
                    break
                case 'fieldset':
                    html += `<fieldset>${this.readForm(e.inputs)}</fieldset>`
            }
        })
        return html
    }

    constructor(root, parent, form){
        this.root = root
        this.parent = parent
        this.form = form

        this.element = document.createElement('div')
        this.element.setAttribute('class', 'popup')
        this.background = document.createElement('div')
        this.background.setAttribute('class', 'popup-background')

        this.element.innerHTML = `<h1>Создание проекта</h1>` + this.readForm(this.form)+`
        <div class="popup-footer">
            <button id="create_button">Создать</button>
        </div>
        `

        this.root.appendChild(this.element)
        this.parent.appendChild(this.background)
    }
}
