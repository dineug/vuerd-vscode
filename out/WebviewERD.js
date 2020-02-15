"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const UndoManager_1 = require("./UndoManager");
const viewType = "vuerd";
class WebviewERD {
    constructor(context, uri, webviewManager, webviewPanel) {
        this.disposables = [];
        this.value$ = new rxjs_1.Subject();
        this.currentValue = "";
        this.uri = uri;
        this.webviewManager = webviewManager;
        this.extensionPath = context.extensionPath;
        this.subValue = this.value$
            .pipe(operators_1.debounceTime(300))
            .subscribe((value) => {
            fs.writeFile(this.uri.fsPath, value, err => {
                if (err) {
                    vscode_1.window.showErrorMessage(err.message);
                }
            });
        });
        if (webviewPanel) {
            this.panel = webviewPanel;
        }
        else {
            const column = vscode_1.window.activeTextEditor
                ? vscode_1.window.activeTextEditor.viewColumn
                : undefined;
            this.panel = vscode_1.window.createWebviewPanel(viewType, path.basename(uri.fsPath), column || vscode_1.ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [
                    vscode_1.Uri.file(path.join(context.extensionPath, "static"))
                ]
            });
        }
        this.undoManager = new UndoManager_1.default(() => {
            this.hasUndoRedo();
        });
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        this.panel.webview.html = this.setupHtml();
        this.panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case "value":
                    if (this.currentValue !== "" &&
                        this.currentValue !== message.value) {
                        const oldValue = this.currentValue;
                        const newValue = message.value;
                        this.undoManager.add({
                            undo: () => {
                                this.panel.webview.postMessage({
                                    command: "value",
                                    value: oldValue
                                });
                                this.currentValue = oldValue;
                                this.value$.next(oldValue);
                            },
                            redo: () => {
                                this.panel.webview.postMessage({
                                    command: "value",
                                    value: newValue
                                });
                                this.currentValue = newValue;
                                this.value$.next(newValue);
                            }
                        });
                    }
                    this.currentValue = message.value;
                    this.value$.next(message.value);
                    return;
                case "getValue":
                    try {
                        this.currentValue = fs.readFileSync(this.uri.fsPath, "utf8");
                        this.panel.webview.postMessage({
                            command: "value",
                            value: this.currentValue
                        });
                        this.panel.webview.postMessage({
                            command: "state",
                            uri: this.uri
                        });
                        this.hasUndoRedo();
                    }
                    catch (err) {
                        vscode_1.window.showErrorMessage(err.message);
                    }
                    return;
                case "undo":
                    this.undoManager.undo();
                    break;
                case "redo":
                    this.undoManager.redo();
                    break;
            }
        }, null, this.disposables);
    }
    dispose() {
        this.webviewManager.remove(this);
        this.panel.dispose();
        while (this.disposables.length) {
            const item = this.disposables.pop();
            if (item) {
                item.dispose();
            }
        }
        this.subValue.unsubscribe();
        this.undoManager.clear();
    }
    hasUndoRedo() {
        this.panel.webview.postMessage({
            command: "hasUndoRedo",
            undo: this.undoManager.hasUndo(),
            redo: this.undoManager.hasRedo()
        });
    }
    setupHtml() {
        const pathVue = vscode_1.Uri.file(path.join(this.extensionPath, "static", "vue.min.js"));
        const pathVuerd = vscode_1.Uri.file(path.join(this.extensionPath, "static", "vuerd-plugin-erd.umd.min.js"));
        const pathMain = vscode_1.Uri.file(path.join(this.extensionPath, "static", "main.js"));
        const pathCss = vscode_1.Uri.file(path.join(this.extensionPath, "static", "vuerd-plugin-erd.css"));
        const uriVue = this.panel.webview.asWebviewUri(pathVue);
        const uriVuerd = this.panel.webview.asWebviewUri(pathVuerd);
        const urlMain = this.panel.webview.asWebviewUri(pathMain);
        const uriCss = this.panel.webview.asWebviewUri(pathCss);
        const nonce = getNonce();
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${this.panel.webview.cspSource} data:; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';"
      >
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vuerd</title>
      <link rel="stylesheet" type="text/css" nonce="${nonce}" href=${uriCss} />
    </head>
    <body>
      <div id="app"></div>
      <script nonce="${nonce}" src=${uriVue}></script>
      <script nonce="${nonce}" src=${uriVuerd}></script>
      <script nonce="${nonce}" src=${urlMain}></script>
    </body>
    </html>
    `;
    }
}
exports.default = WebviewERD;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=WebviewERD.js.map