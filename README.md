# vuerd-vscode

> [vuerd](https://github.com/vuerd/vuerd) ERD Editor vscode extension

[![npm version](https://img.shields.io/npm/v/vuerd.svg?color=blue)](https://www.npmjs.com/package/vuerd) [![VS Marketplace version](https://vsmarketplacebadge.apphb.com/version-short/dineug.vuerd-vscode.svg?color=blue)](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) [![GitHub](https://img.shields.io/github/license/vuerd/vuerd)](https://github.com/vuerd/vuerd/blob/master/LICENSE)

## ERD

![vuerd](https://github.com/vuerd/vuerd/blob/master/img/vuerd-erd.gif?raw=true)

## SQL DDL

![vuerd](https://github.com/vuerd/vuerd/blob/master/img/vuerd-ddl.gif?raw=true)

## Generator Code

![vuerd](https://github.com/vuerd/vuerd/blob/master/img/vuerd-generator-code.gif?raw=true)

## Visualization

![vuerd](https://github.com/vuerd/vuerd/blob/master/img/vuerd-visualization.gif?raw=true)

## SQL DDL Import

![vuerd](https://github.com/vuerd/vuerd/blob/master/img/vuerd-ddl-import.gif?raw=true)

## Usage

1. ERD data [filename].vuerd.json Save a file as a form
1. Focus on the saved file and click the vuerd icon in the upper right corner of the Editor window  
   ![Image](./img/vuerd-vscode-1.png)  
   ![Image](./img/vuerd-vscode-2.png)

## Document

- [Live Demo](https://vuerd.github.io/vuerd/)

## Editor Keymap(default)

| Name                                                | Action                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| Editing - ERD                                       | dblclick, Enter                                                          |
| Editing - Grid                                      | dblclick, Enter                                                          |
| All Stop                                            | Escape                                                                   |
| filter - Grid                                       | Ctrl + Alt + F                                                           |
| Selection - table, memo                             | Ctrl + Drag, Click, Ctrl + Click, Ctrl + Alt + A                         |
| Selection - column, filter                          | Click, Ctrl + Click, Shift + Click, Shift + Arrow key(up, down), Alt + A |
| Movement - table, memo, column, filter              | Drag, Ctrl + Drag                                                        |
| Copy - column                                       | Ctrl + C                                                                 |
| Paste - column                                      | Ctrl + V                                                                 |
| Contextmenu - ERD, Relationship, SQL, GeneratorCode | Right-click                                                              |
| New Table                                           | Alt + N                                                                  |
| New Memo                                            | Alt + M                                                                  |
| New - Column, filter                                | Alt + Enter                                                              |
| Delete - table, memo                                | Ctrl + Delete                                                            |
| Delete - column, filter                             | Alt + Delete                                                             |
| Select DataType Hint                                | Arrow key(right), Click                                                  |
| Move DataType Hint                                  | Arrow key(up, down)                                                      |
| Primary Key                                         | Alt + K                                                                  |
| checkbox - Grid, filter                             | Space, Click                                                             |
| Move checkbox - Grid, filter                        | Arrow key(up, down, left, right)                                         |
| Relationship - Zero One N                           | Ctrl + Alt + 1                                                           |
| Relationship - Zero One                             | Ctrl + Alt + 2                                                           |
| Relationship - Zero N                               | Ctrl + Alt + 3                                                           |
| Relationship - One Only                             | Ctrl + Alt + 4                                                           |
| Relationship - One N                                | Ctrl + Alt + 5                                                           |
| Relationship - One                                  | Ctrl + Alt + 6                                                           |
| Relationship - N                                    | Ctrl + Alt + 7                                                           |

## TODO

- [ ] Undo, Redo Manager
- [x] Grid filter
- [ ] ERD Table finder
- [ ] Real-time simultaneous editing api
- [ ] SQL index Support [#9](https://github.com/vuerd/vuerd-vscode/issues/9)
- SQL DDL import Support [#7](https://github.com/vuerd/vuerd-vscode/issues/7)
  - [ ] Oracle
  - [ ] MSSQL
  - [ ] PostgreSQL
- [ ] SQL-Query generator [#3](https://github.com/vuerd/vuerd/issues/3)

## License

[MIT](https://github.com/vuerd/vuerd-vscode/blob/master/LICENSE)
