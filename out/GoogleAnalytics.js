"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const electron_google_analytics_1 = require("electron-google-analytics");
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
        s4()
    ].join("");
}
const analytics = new electron_google_analytics_1.default("UA-131336352-5");
const clientID = uuid();
function sendEvent() {
    analytics.event("webview", "open", {
        evLabel: "use",
        clientID: clientID
    });
}
exports.sendEvent = sendEvent;
//# sourceMappingURL=GoogleAnalytics.js.map