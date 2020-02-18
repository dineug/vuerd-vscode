import * as path from "path";
import * as fs from "fs";
import {
  Disposable,
  WebviewPanel,
  Uri,
  ExtensionContext,
  window,
  ViewColumn
} from "vscode";
import WebviewManager from "./WebviewManager";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import UndoManager from "./UndoManager";

const viewType = "vuerd";

export default class WebviewERD {
  private extensionPath: string;
  private disposables: Disposable[] = [];
  private webviewManager: WebviewManager;
  private value$: Subject<string> = new Subject();
  private subValue: Subscription;
  private undoManager: UndoManager;
  private currentValue = "";

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
    this.subValue = this.value$
      .pipe(debounceTime(300))
      .subscribe((value: string) => {
        fs.writeFile(this.uri.fsPath, value, err => {
          if (err) {
            window.showErrorMessage(err.message);
          }
        });
      });

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
            Uri.file(path.join(context.extensionPath, "static"))
          ]
        }
      );
    }

    this.undoManager = new UndoManager(() => {
      this.hasUndoRedo();
    });
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.html = this.setupHtml();
    this.panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "value":
            if (
              this.currentValue !== "" &&
              this.currentValue !== message.value
            ) {
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
            } catch (err) {
              window.showErrorMessage(err.message);
            }
            return;
          case "undo":
            this.undoManager.undo();
            break;
          case "redo":
            this.undoManager.redo();
            break;
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
    this.subValue.unsubscribe();
    this.undoManager.clear();
  }

  private hasUndoRedo() {
    this.panel.webview.postMessage({
      command: "hasUndoRedo",
      undo: this.undoManager.hasUndo(),
      redo: this.undoManager.hasRedo()
    });
  }

  private setupHtml() {
    const pathVue = Uri.file(
      path.join(this.extensionPath, "static", "vue.min.js")
    );
    const pathVuerd = Uri.file(
      path.join(this.extensionPath, "static", "vuerd.umd.min.js")
    );
    const pathMain = Uri.file(
      path.join(this.extensionPath, "static", "main.js")
    );
    const pathCss = Uri.file(
      path.join(this.extensionPath, "static", "vuerd.css")
    );

    const uriVue = this.panel.webview.asWebviewUri(pathVue);
    const uriVuerd = this.panel.webview.asWebviewUri(pathVuerd);
    const urlMain = this.panel.webview.asWebviewUri(pathMain);
    const uriCss = this.panel.webview.asWebviewUri(pathCss);
    const nonce = getNonce();
    const cspSource = this.panel.webview.cspSource;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${cspSource} data:; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';"
      >
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vuerd</title>
      <link rel="stylesheet" type="text/css" href=${uriCss} />
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

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
