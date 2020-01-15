"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const WebviewManager_1 = require("./WebviewManager");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("vuerd.open", (uri) => {
        if (uri instanceof vscode.Uri) {
            return WebviewManager_1.webviewManager.add(context, uri);
        }
        else {
            vscode.window.showInformationMessage("Open a vuerd.json file first to show");
            return;
        }
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map