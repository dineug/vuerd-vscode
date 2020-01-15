"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebviewERD_1 = require("./WebviewERD");
class WebviewManager {
    constructor() {
        this.erdList = [];
    }
    add(context, uri) {
        let erd = this.find(uri);
        if (erd === null) {
            erd = new WebviewERD_1.default(context, uri, this);
            this.erdList.push(erd);
        }
        else {
            erd.panel.reveal();
        }
        return erd;
    }
    remove(erd) {
        const index = this.erdList.indexOf(erd);
        if (index >= 0) {
            this.erdList.splice(index, 1);
        }
    }
    find(uri) {
        let target = null;
        for (const erd of this.erdList) {
            if (erd.uri.fsPath === uri.fsPath) {
                target = erd;
                break;
            }
        }
        return target;
    }
}
exports.webviewManager = new WebviewManager();
exports.default = WebviewManager;
//# sourceMappingURL=WebviewManager.js.map