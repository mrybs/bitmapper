# Bitmapper
Пиксельный редактор(пока что рисовалка)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mrybs/bitmapper/static.yml)

![License](https://img.shields.io/github/license/mrybs/bitmapper)
![GitHub top language](https://img.shields.io/github/languages/top/mrybs/bitmapper)
![GitHub language count](https://img.shields.io/github/languages/count/mrybs/bitmapper)


![GitHub Repo stars](https://img.shields.io/github/stars/mrybs/bitmapper)
![GitHub watchers](https://img.shields.io/github/watchers/mrybs/bitmapper)
![GitHub forks](https://img.shields.io/github/forks/mrybs/bitmapper)

![GitHub contributors](https://img.shields.io/github/contributors/mrybs/bitmapper)


![GitHub commit activity](https://img.shields.io/github/commit-activity/w/mrybs/bitmapper)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/mrybs/bitmapper)
![GitHub last commit](https://img.shields.io/github/last-commit/mrybs/bitmapper)
![GitHub Created At](https://img.shields.io/github/created-at/mrybs/bitmapper)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mrybs/bitmapper)
![GitHub repo size](https://img.shields.io/github/repo-size/mrybs/bitmapper)
![GitHub repo file or directory count](https://img.shields.io/github/directory-file-count/mrybs/bitmapper)

### Управление
Рисовать на холсте ЛКМ или просто одним пальцем

Перемещать холст ПКМ

Масштабировать холст колесиком мыши

Горячие клавиши(пока одна):
![hotkeys](hotkeys.png "Горячие клавиши")

### Плагины
Все плагины представляют собой .js файлы с классом, унаследованным от Plugin https://github.com/mrybs/bitmapper/blob/master/plugins/plugin.js
```js
Plugin.meta = {
    id: 'plugin-id',
    name: 'Название плагина',
    version: '1.0.0',
    require: []
}
```

Также в плагине должен присутствовать метод load, отвечающий за загрузку плагина
