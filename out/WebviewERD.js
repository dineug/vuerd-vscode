"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const viewType = "vuerd";
class WebviewERD {
    constructor(context, uri, webviewManager, webviewPanel) {
        this.disposables = [];
        this.uri = uri;
        this.webviewManager = webviewManager;
        this.extensionPath = context.extensionPath;
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
                    vscode_1.Uri.file(path.join(context.extensionPath, "static")),
                ],
            });
        }
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        this.panel.webview.html = this.setupHtml();
        this.panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case "value":
                    fs.writeFile(this.uri.fsPath, JSON.stringify(JSON.parse(message.value), null, 2), err => {
                        if (err) {
                            vscode_1.window.showErrorMessage(err.message);
                        }
                    });
                    return;
                case "getValue":
                    try {
                        const value = fs.readFileSync(this.uri.fsPath, "utf8");
                        this.panel.webview.postMessage({
                            command: "value",
                            value,
                        });
                        this.panel.webview.postMessage({
                            command: "state",
                            uri: this.uri,
                        });
                    }
                    catch (err) {
                        vscode_1.window.showErrorMessage(err.message);
                    }
                    return;
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
    }
    setupHtml() {
        const pathVuerd = vscode_1.Uri.file(path.join(this.extensionPath, "static", "vuerd.min.js"));
        const pathMain = vscode_1.Uri.file(path.join(this.extensionPath, "static", "main.js"));
        const uriVuerd = this.panel.webview.asWebviewUri(pathVuerd);
        const urlMain = this.panel.webview.asWebviewUri(pathMain);
        const nonce = getNonce();
        const cspSource = this.panel.webview.cspSource;
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" 
      content="default-src * ${cspSource} https: 'unsafe-inline' 'unsafe-eval';
        script-src ${cspSource} blob: data: https: 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}';
        style-src ${cspSource} https: 'unsafe-inline';
        img-src ${cspSource} data: https:;
        connect-src ${cspSource} blob: data: https: http:;">      
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vuerd</title>
    </head>
    <body>
      <div id="app"></div>
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