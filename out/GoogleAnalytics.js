"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackEvent = void 0;
// @ts-ignore
const vscode_google_analytics_1 = require("@dineug/vscode-google-analytics");
function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function uuid() {
    return [
        s4(),
        s4(),
        "-",
        s4(),
        "-",
        s4(),
        "-",
        s4(),
        "-",
        s4(),
        s4(),
        s4(),
    ].join("");
}
const analytics = new vscode_google_analytics_1.Analytics("UA-131336352-5");
const clientID = uuid();
function trackEvent() {
    analytics.send({
        category: "vscode",
        action: "open",
        label: "webview",
        clientID,
    });
}
exports.trackEvent = trackEvent;
//# sourceMappingURL=GoogleAnalytics.js.map