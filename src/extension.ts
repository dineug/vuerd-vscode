import * as path from "path";
import {
  ExtensionContext,
  Uri,
  commands,
  window,
  WebviewPanel,
  workspace,
  TextDocument
} from "vscode";
import { webviewManager } from "./WebviewManager";
import { sendEvent } from "./GoogleAnalytics";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("vuerd.open", (uri: any) => {
      if (uri instanceof Uri) {
        sendEvent();
        return webviewManager.add(context, uri);
      } else {
        window.showInformationMessage("Open a vuerd.json file first to show");
        return;
      }
    })
  );

  if (window.registerWebviewPanelSerializer) {
    window.registerWebviewPanelSerializer("vuerd", {
      async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any) {
        const uri = state.uri as Uri;
        webviewManager.revive(context, uri, webviewPanel);
        sendEvent();
      }
    });
  }

  // Automatically preview content piped from stdin (when VSCode is already open)
  workspace.onDidOpenTextDocument(document => {
    if (isVuerdFile(document)) {
      commands.executeCommand("vuerd.open", document.uri);
    }
  });

  // Automaticlly preview content piped from stdin (when VSCode first starts up)
  if (window.activeTextEditor) {
    const document = window.activeTextEditor.document;
    if (isVuerdFile(document)) {
      commands.executeCommand("vuerd.open", document.uri);
    }
  }
}

export function deactivate() {}

function isVuerdFile(document: TextDocument) {
  return document && path.basename(document.fileName).match(/\.(vuerd.json)$/i);
}
