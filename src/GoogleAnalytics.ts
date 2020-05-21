import got from "got";

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

export function trackEvent() {
  const form = {
    v: 1,
    tid: "UA-131336352-5",
    cid: clientID,
    t: "event",
    ec: "vscode",
    ea: "open",
    el: "webview",
  };
  return got
    .post("https://www.google-analytics.com/collect", {
      form,
    })
    .then((res) => {
      return { clientID };
    })
    .catch((err) => {
      return new Error(err);
    });
}
