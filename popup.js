class Popup{
    readForm(form){
        let html = ''
        if(form.hasOwnProperty('title')) {
            html += `<h1>${form.title}</h1>`
        }
        form.inputs.forEach((input) => {
            switch(input.type){
                case 'text_input':
                    html += `
                        <div class="input-wrapper">
                            <label for="${input.id}">${input.label}</label>
                            <input type="text" id="${input.id}" value="${input.value}">
                        </div>
                    `
                    break
                case 'number_input':
                    html += `
                        <div class="input-wrapper">
                            <label for="${input.id}">${input.label}</label>
                            <input type="number" id="${input.id}" value="${input.value}">
                        </div>
                    `
                    break
                case 'radio':
                    html += `
                        <input type="radio" id="${input.id}" name="${input.name}" ${input.checked ? "checked" : ""}/>
                        <label for="${input.id}">${input.label}</label>
                        <br>
                    `
                    break
                case 'fieldset':
                    html += `
                        <fieldset>${this.readForm(input)}</fieldset>
                    `
            }
        })
        if(form.hasOwnProperty('actionButtons')) {
            html += '<div class="popup-footer">'
            form.actionButtons.forEach(actionButton => {
                html += `
                <button id="${actionButton.id}">${actionButton.label}</button>
            `
            })
            html += '</div>'
        }
        return html
    }

    readValue(form){
        let values = {}
        form.inputs.forEach((input) => {
            switch(input.type){
                case 'text_input':
                    values[input.id] = document.getElementById(input.id).value
                    break
                case 'number_input':
                    values[input.id] = document.getElementById(input.id).value-0
                    break
                case 'radio':
                    values[input.id] = document.getElementById(input.id).checked
                    break
                case 'fieldset':
                    values = Object.assign(values, this.readValue(input))
                    break
            }
        })
        return values
    }

    constructor(root, parent, form){
        this.root = root
        this.parent = parent
        this.form = form

        this.element = document.createElement('div')
        this.element.setAttribute('class', 'popup')
        this.background = document.createElement('div')
        this.background.setAttribute('class', 'popup-background')

        this.element.innerHTML = this.readForm(this.form)

        this.root.appendChild(this.element)
        this.parent.appendChild(this.background)

        form.actionButtons.forEach(actionButton => {
            document.getElementById(actionButton.id).addEventListener('click', (event) => {
                actionButton.action(event, this)
            })
        })


    }

    getValues(){
        return this.readValue(this.form)
    }

    close(){
        this.element.remove()
        this.background.remove()
    }
}
