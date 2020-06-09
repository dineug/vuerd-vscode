import * as vscode from "vscode";
import { getHtmlForWebview } from "./util";

export class ERDEditorTextProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new ERDEditorTextProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      ERDEditorTextProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "vuerd.editor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = getHtmlForWebview(
      webviewPanel.webview,
      this.context
    );

    function updateWebview() {
      webviewPanel.webview.postMessage({
        command: "value",
        value: document.getText(),
      });
    }

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview();
        }
      }
    );

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.command) {
        case "value":
          this.updateTextDocument(document, JSON.parse(e.value));
          return;
        case "getValue":
          updateWebview();
          return;
      }
    });
  }

  private updateTextDocument(document: vscode.TextDocument, json: any) {
    const edit = new vscode.WorkspaceEdit();

    // Just replace the entire document every time for this example extension.
    // A more complete extension should compute minimal edits instead.
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(json, null, 2)
    );

    return vscode.workspace.applyEdit(edit);
  }
}
