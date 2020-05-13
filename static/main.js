(function() {
  document.body.style = `padding: 0; margin: 0;`;
  let editor = null;
  const vscode = acquireVsCodeApi();

  // receive: extension message
  window.addEventListener("message", event => {
    const message = event.data;
    switch (message.command) {
      case "value":
        if (editor !== null) {
          editor.addEventListener("change", event => {
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
  });

  const container = document.querySelector("#app");
  editor = document.createElement("erd-editor");
  vscode.postMessage({
    command: "getValue",
  });
  window.addEventListener("resize", () => {
    editor.width = window.innerWidth;
    editor.height = window.innerHeight;
  });
  window.dispatchEvent(new Event("resize"));
  container.appendChild(editor);
})();
