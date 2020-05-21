// @ts-ignore
import { Analytics } from "@dineug/vscode-google-analytics";

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

const analytics = new Analytics("UA-131336352-5");
const clientID = uuid();

export function trackEvent() {
  analytics.send({
    category: "vscode",
    action: "open",
    label: "webview",
    clientID,
  });
}
