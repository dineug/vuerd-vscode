import * as path from "path";
import * as vscode from "vscode";
import { webviewManager } from "./WebviewManager";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("vuerd.open", (uri: any) => {
      if (uri instanceof vscode.Uri) {
        return webviewManager.add(context, uri);
      } else {
        vscode.window.showInformationMessage(
          "Open a vuerd.json file first to show"
        );
        return;
      }
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer("vuerd", {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        const uri = state.uri as vscode.Uri;
        webviewManager.revive(context, uri, webviewPanel);
      }
    });
  }

  // Automatically preview content piped from stdin (when VSCode is already open)
  vscode.workspace.onDidOpenTextDocument(document => {
    if (isVuerdFile(document)) {
      vscode.commands.executeCommand("vuerd.open", document.uri);
    }
  });

  // Automaticlly preview content piped from stdin (when VSCode first starts up)
  if (vscode.window.activeTextEditor) {
    const document = vscode.window.activeTextEditor.document;
    if (isVuerdFile(document)) {
      vscode.commands.executeCommand("vuerd.open", document.uri);
    }
  }
}

export function deactivate() {}

function isVuerdFile(document: vscode.TextDocument) {
  return document && path.basename(document.fileName).match(/\.(vuerd.json)$/i);
}
