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
import { getHtmlForWebview } from "./util";
import WebviewManager from "./WebviewManager";

const viewType = "vuerd.webview";

export default class WebviewERD {
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
    this.panel.webview.html = getHtmlForWebview(this.panel.webview, context);
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "value":
            fs.writeFile(
              this.uri.fsPath,
              Buffer.from(JSON.stringify(JSON.parse(message.value), null, 2)),
              (err) => {
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
}
