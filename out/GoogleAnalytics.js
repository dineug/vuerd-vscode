"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackEvent = void 0;
const node_fetch_1 = require("node-fetch");
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
const clientID = uuid();
function trackEvent() {
    const formObj = {
        v: "1",
        tid: "UA-131336352-5",
        cid: clientID,
        t: "event",
        ec: "vscode",
        ea: "open",
        el: "webview",
    };
    return node_fetch_1.default("https://www.google-analytics.com/collect", {
        method: "POST",
        body: Object.keys(formObj)
            .map((key) => `${encodeURI(key)}=${encodeURI(formObj[key])}`)
            .join("&"),
    })
        .then((res) => res.text())
        .then(() => {
        return { clientID };
    })
        .catch((err) => {
        return new Error(err);
    });
}
exports.trackEvent = trackEvent;
//# sourceMappingURL=GoogleAnalytics.js.map