# vuerd-vscode

> [vuerd](https://github.com/vuerd/vuerd) ERD Editor vscode extension

[![npm version](https://img.shields.io/npm/v/vuerd.svg?color=blue)](https://www.npmjs.com/package/vuerd) [![VS Marketplace version](https://vsmarketplacebadge.apphb.com/version-short/dineug.vuerd-vscode.svg?color=blue)](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) [![GitHub](https://img.shields.io/github/license/vuerd/vuerd)](https://github.com/vuerd/vuerd/blob/master/LICENSE)

## ERD

![vuerd](./img/vuerd-erd.gif)

## SQL DDL

![vuerd](./img/vuerd-ddl.gif)

## Generator Code

![vuerd](./img/vuerd-generator-code.gif)

## Visualization

![vuerd](./img/vuerd-visualization.gif)

## SQL DDL Import

![vuerd](./img/vuerd-ddl-import.gif)

## Usage

1. ERD data [filename].vuerd.json Save a file as a form
1. Focus on the saved file and click the vuerd icon in the upper right corner of the Editor window  
   ![Image](./img/vuerd-vscode-1.png)  
   ![Image](./img/vuerd-vscode-2.png)

## Document

- [Live Demo](https://vuerd.github.io/vuerd/)

## Editor Action

| Name                            | Action                                                   |
| ------------------------------- | -------------------------------------------------------- |
| Multiple selection(table, memo) | Ctrl + Drag, Ctrl + Click, Ctrl + A                      |
| Multi-movement(table, memo)     | Ctrl + Drag                                              |
| Column shift                    | Drag                                                     |
| Multiple selection(column)      | Ctrl + Click, Shift + Click, Shift + Arrow key(up, down) |
| Copy&Paste(column)              | Ctrl + C, Ctrl + V                                       |
| Contextmenu                     | Right-click                                              |
| New Table                       | Alt + N                                                  |
| New Memo                        | Alt + M                                                  |
| New Column                      | Alt + Enter                                              |
| Delete(table, memo)             | Ctrl + Delete                                            |
| Delete(column)                  | Alt + Delete                                             |
| Select DataType Hint            | Arrow key(right), Click                                  |
| Move DataType Hint              | Arrow key(up, down)                                      |
| Relationship ZeroOne            | Alt + 1                                                  |
| Relationship ZeroOneN           | Alt + 2                                                  |
| Primary Key                     | Alt + K                                                  |
| Undo                            | Ctrl + Z                                                 |
| Redo                            | Ctrl + Shift + Z                                         |
| Editing                         | Enter, dblclick                                          |
| All Action Stop                 | ESC                                                      |

## License

[MIT](https://github.com/vuerd/vuerd-vscode/blob/master/LICENSE)
