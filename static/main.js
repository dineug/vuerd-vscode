(function () {
  document.body.style = `padding: 0; margin: 0;`;
  let editor = null;
  const vscode = acquireVsCodeApi();

  // receive: extension message
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command) {
      // webview API
      switch (message.command) {
        case "value":
          if (editor !== null) {
            editor.addEventListener("change", (event) => {
              vscode.postMessage({
                command: "value",
                value: event.target.value,
              });
            });
            editor.initLoadJson(message.value);
          }
          break;
        case "state":
          vscode.setState({ uri: message.uri });
          break;
      }
    } else if (editor !== null && message.type) {
      // custom editor API
      const { type, body, requestId } = message;
      if (type === "init") {
        const value = new TextDecoder("utf-8").decode(
          new Uint8Array(body.value.data)
        );
        editor.addEventListener("change", (event) => {
          vscode.postMessage({
            type: "value",
            value: event.target.value,
          });
        });
        editor.initLoadJson(value);
      } else if (type === "update") {
        const data = body.content
          ? new Uint8Array(body.content.data)
          : undefined;
        const value = new TextDecoder("utf-8").decode(data);
        editor.value = value;
      } else if (type === "getFileData") {
        const data = new TextEncoder("utf-8").encode(editor.value);
        vscode.postMessage({ type: "response", requestId, body: data });
      }
    }
  });

  const container = document.querySelector("#app");
  editor = document.createElement("erd-editor");
  vscode.postMessage({
    command: "getValue",
  });
  container.appendChild(editor);
  window.addEventListener("resize", () => {
    editor.width = window.innerWidth;
    editor.height = window.innerHeight;
  });
  window.dispatchEvent(new Event("resize"));
})();
