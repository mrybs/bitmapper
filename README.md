# Bitmapper
Пиксельный редактор(пока что рисовалка :bowtie:)

[mrybs.github.io/bitmapper](https://mrybs.github.io/bitmapper/)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mrybs/bitmapper/static.yml)

![GitHub Repo stars](https://img.shields.io/github/stars/mrybs/bitmapper)
![GitHub watchers](https://img.shields.io/github/watchers/mrybs/bitmapper)
![GitHub forks](https://img.shields.io/github/forks/mrybs/bitmapper)

![License](https://img.shields.io/github/license/mrybs/bitmapper)
![GitHub top language](https://img.shields.io/github/languages/top/mrybs/bitmapper)
![GitHub language count](https://img.shields.io/github/languages/count/mrybs/bitmapper)
![GitHub contributors](https://img.shields.io/github/contributors/mrybs/bitmapper)

![GitHub last commit](https://img.shields.io/github/last-commit/mrybs/bitmapper)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/mrybs/bitmapper)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/mrybs/bitmapper)
![GitHub Created At](https://img.shields.io/github/created-at/mrybs/bitmapper)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mrybs/bitmapper)
![GitHub repo size](https://img.shields.io/github/repo-size/mrybs/bitmapper)
![GitHub repo file or directory count](https://img.shields.io/github/directory-file-count/mrybs/bitmapper)

<img src="docs/images/screenshot.png" alt="Сам редактор" style="width: 98%"/>

## Использование
### Управление
- Рисовать на холсте ЛКМ или просто одним пальцем.
- Перемещать холст ПКМ, с тач-экранов никак.
- Масштабировать холст колесиком мыши, с тач-экранов никак.

**Горячие клавиши(пока одна):**

<img src="docs/images/hotkeys.png" alt="Горячие клавиши" style="width: 98%"/>

## Модификация

- [Плагины](#mods-plugins)
- [Кисти](#mods-brushes)
- [Инструменты разработчика](#mods-devtools)
- [Тест производительности](#mods-benchmark)

### <a id="mods-plugins">Плагины</a>
Все плагины представляют собой .js файлы с классом, унаследованным от Plugin https://github.com/mrybs/bitmapper/blob/master/plugins/plugin.js

В каждом классе плагина должно присутствовать поле meta:
```js
Plugin.meta = {
    id: 'author.plugin-id',
    name: 'Название плагина',
    version: '1.0.0',
    author: 'Автор плагина',
    require: []
}
```

Также в плагине должен присутствовать метод load, отвечающий за загрузку плагина.

Собственно вот хелоуворлд плагин:

```js
class MyFirstPlugin extends Plugin{
    constructor(){
        super()
        this.meta = {
            id: 'mrybs.my-first-plugin',
            name: 'Мой первый плагин',
            version: '0.0.1',
            author: 'Mr. Ybs',
            require: []
        }
    }
    load(){
        setTimeout(() => {
            alert('Hello, world!')
        }, 0)
    }
}
```

> [!IMPORTANT]
> Здесь alert `Hello, world!` выполняется через setTimeout с задержкой 0 дабы не занимать основой поток. В будущих сборках битмаппера будут ограничения по времени загрузки плагина, поэтому работа плагина может быть нарушена.

### <a id="mods-brushes">Кисти</a>
Все кисти представляют собой классы, унаследованные от Brush https://github.com/mrybs/bitmapper/blob/master/brush.js

В каждой кисти должно присутствовать поле meta:

```js
Brush.meta = {
    id: 'mrybs.my-first-brush-plugin.brush',
    name: 'Кисть'
}
```

В конструктор кисти принимается canvas рабочей области и size размер кисти. От канваса по сути нужен только его метод canvas.setPixel(pos, color), который устанавливает заданный цвет color на координату pos рабочей области.

Рисованием занимается метод кисти draw. Он принимает в качестве аргументов pos позицию рабочей области на которой была использована кисть и color цвет кисти. 

Собственно вот пример кисти, которая рисует квадраты заданных размеров size в конструкторе:

```js
class SquaredBrush extends Brush{
    constructor(canvas, size){
        super(canvas, size)
        this.meta = {
            'name': 'Квадратная кисть'
        }
    }
    draw(pos, style){
        for(let yi = 0; yi < this.size; yi++){
            for(let xi = 0; xi < this.size; xi++){
                this.canvas.setPixel(
                    new Vector(pos.x-this.size/2+xi, pos.y-this.size/2+yi).round(), 
                    style
                )
            }
        }
    }
}
```

> [!NOTE]
> Кисть должна устанавливаться с помощью плагина

```js
class SquaredBrushPlugin extends Plugin{
    constructor(){
        super()
        this.meta = {
            id: 'mrybs.squared-brush-plugin',
            name: 'Плагин квадратной кисти',
            version: '1.0.0',
            author: 'Mr. Ybs',
            require: [
                'mrybs.core'
            ]
        }
    }
    
    load(){
        this.loadBrush(SquaredBrush)
    }
}
```

Здесь в `require` указан плагин `mrybs.core`, без него ничего работать не будет — это основной плагин на котором работает битмаппер

### <a id="mods-devtools">Инструменты разработчика</a>

Чтобы открыть инструменты разработчика есть два способа:

- Нажать `ъ` или `]`(как обозначено на клавиатуре в начале документа)
- В адресной строке в конце ссылки прописать `#dev` и обновить страницу

<div>
  <img src="docs/images/devtools1.png" alt="Инструменты разработчика 1" style="width: 47%"/>
  <img src="docs/images/devtools2.png" alt="Инструменты разработчика 2" style="width: 51%"/>
</div>

- В инструментах разработчика указаны загруженные плагины в формате `Имя Версия`
- Проблемные плагины указаны в отдельной секции и подсвечены определенным цветом в зависимости от типа проблемы:

  - Красный — ошибка при загрузке
  - Оранжевый — нет какой-либо зависимости
  - Желтый — при загрузке зависимости возникла ошибка
  - Фиолетовый — загрузка плагина вышла из лимита по времени

- Следующая секция показывает координату пикселя рабочей области под курсором. Эта секция появится только при наведении курсора на рабочую область, поэтому на устройствах с тач-экранами ее не будет
- Последняя секция выводит размер текущей рабочей области в пикселях

Также некоторая информация выводится в консоль(например, статус плагинов, вывод конкретных ошибок):

<img src="docs/images/console.png" alt="Консоль" style="width: 98%"/>

### <a id="mods-benchmark">Тест производительности</a>

Если в адресной строке в конце ссылки прописать `#benchmark` и обновить страницу, то после создания проекта запустится тестирование частоты кадров отрисовки инструмента выбора цвета и отрисовки рабочей области.
Это также можно использовать с плагинами в каких-то своих целях


