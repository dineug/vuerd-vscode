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
}
