"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
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
    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer("vuerd", {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    const uri = state.uri;
                    WebviewManager_1.webviewManager.revive(context, uri, webviewPanel);
                });
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
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function isVuerdFile(document) {
    return document && path.basename(document.fileName).match(/\.(vuerd.json)$/i);
}
//# sourceMappingURL=extension.js.map