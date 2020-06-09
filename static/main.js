(function () {
  document.body.style = `padding: 0; margin: 0;`;
  let editor = null;
  const vscode = acquireVsCodeApi();

  // receive: extension message
  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
      case "value":
        if (editor !== null) {
          const value = message.value;
          editor.addEventListener("change", (event) => {
            vscode.postMessage({
              command: "value",
              value: event.target.value,
            });
          });
          if (typeof value === "string" && value.trim() !== "") {
            editor.initLoadJson(value);
          }
        }
        break;
      case "state":
        vscode.setState({ uri: message.uri });
        break;
    }
    const { type, body, requestId } = event.data;
    switch (type) {
      case "init":
        const data = new Uint8Array(body.value.data);
        const value = new TextDecoder("utf-8").decode(data);
        editor.addEventListener("change", (event) => {
          vscode.postMessage({
            type: "value",
            value: event.target.value,
          });
        });
        if (typeof value === "string" && value.trim() !== "") {
          editor.initLoadJson(value);
        }
        break;
      case "update":
        if (editor !== null) {
          const data = body.content
            ? new Uint8Array(body.content.data)
            : undefined;
          const value = new TextDecoder("utf-8").decode(data);
          editor.value = value;
        }
        break;
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
