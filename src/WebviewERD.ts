import * as path from "path";
import * as fs from "fs";
import {
  Disposable,
  WebviewPanel,
  Uri,
  ExtensionContext,
  window,
  ViewColumn,
} from "vscode";
import WebviewManager from "./WebviewManager";

const viewType = "vuerd";

export default class WebviewERD {
  private extensionPath: string;
  private disposables: Disposable[] = [];
  private webviewManager: WebviewManager;

  public panel: WebviewPanel;
  public uri: Uri;

  constructor(
    context: ExtensionContext,
    uri: Uri,
    webviewManager: WebviewManager,
    webviewPanel?: WebviewPanel
  ) {
    this.uri = uri;
    this.webviewManager = webviewManager;
    this.extensionPath = context.extensionPath;

    if (webviewPanel) {
      this.panel = webviewPanel;
    } else {
      const column = window.activeTextEditor
        ? window.activeTextEditor.viewColumn
        : undefined;
      this.panel = window.createWebviewPanel(
        viewType,
        path.basename(uri.fsPath),
        column || ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            Uri.file(path.join(context.extensionPath, "static")),
          ],
        }
      );
    }

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.html = this.setupHtml();
    this.panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "value":
            fs.writeFile(
              this.uri.fsPath,
              JSON.stringify(JSON.parse(message.value), null, 2),
              err => {
                if (err) {
                  window.showErrorMessage(err.message);
                }
              }
            );
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
            } catch (err) {
              window.showErrorMessage(err.message);
            }
            return;
        }
      },
      null,
      this.disposables
    );
  }

  public dispose() {
    this.webviewManager.remove(this);
    this.panel.dispose();
    while (this.disposables.length) {
      const item = this.disposables.pop();
      if (item) {
        item.dispose();
      }
    }
  }

  private setupHtml() {
    const pathVuerd = Uri.file(
      path.join(this.extensionPath, "static", "vuerd.min.js")
    );
    const pathMain = Uri.file(
      path.join(this.extensionPath, "static", "main.js")
    );

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

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
