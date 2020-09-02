(function () {
  // function getTheme(name) {
  //   return getComputedStyle(document.documentElement).getPropertyValue(
  //     `--vscode-${name.replace(".", "-")}`
  //   );
  // }

  document.body.style = `padding: 0; margin: 0;`;
  const container = document.querySelector("#app");
  const editor = document.createElement("erd-editor");
  const vscode = acquireVsCodeApi();
  // const vscodeTheme = {
  //   canvas: getTheme("editor.background"),
  //   table: getTheme("editor.background"),
  //   tableActive: getTheme("editor.background"),
  //   focus: getTheme("editor.background"),
  //   keyPK: getTheme("editor.background"),
  //   keyFK: getTheme("editor.background"),
  //   keyPFK: getTheme("editor.background"),
  //   font: getTheme("editor.background"),
  //   fontActive: getTheme("editor.background"),
  //   fontPlaceholder: getTheme("editor.background"),
  //   contextmenu: getTheme("editor.background"),
  //   contextmenuActive: getTheme("editor.background"),
  //   edit: getTheme("editor.background"),
  //   columnSelect: getTheme("editor.background"),
  //   columnActive: getTheme("editor.background"),
  //   minimapShadow: getTheme("editor.background"),
  //   scrollBarThumb: getTheme("editor.background"),
  //   scrollBarThumbActive: getTheme("editor.background"),
  //   menubar: getTheme("editor.background"),
  //   visualization: getTheme("editor.background"),
  // };
  let isInit = false;

  window.addEventListener("resize", () => {
    editor.width = window.innerWidth;
    editor.height = window.innerHeight;
  });
  window.dispatchEvent(new Event("resize"));
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command) {
      // webview API
      switch (message.command) {
        case "value":
          editor.addEventListener("change", (event) => {
            vscode.postMessage({
              command: "value",
              value: event.target.value,
            });
          });
          editor.initLoadJson(message.value);
          container.appendChild(editor);
          break;
        case "state":
          vscode.setState({ uri: message.uri });
          break;
        case "theme":
          editor.setTheme(message.value);
          break;
      }
    } else if (message.type) {
      // custom editor API
      const { type, body, requestId } = message;
      if (type === "init") {
        editor.addEventListener("change", (event) => {
          vscode.postMessage({
            type: "value",
            value: event.target.value,
          });
        });
        editor.initLoadJson(body.value);
        container.appendChild(editor);
        isInit = true;
      } else if (type === "update") {
        editor.value = body.value;
      } else if (type === "getFileData") {
        if (isInit) {
          vscode.postMessage({
            type: "response",
            requestId,
            body: {
              value: editor.value,
            },
          });
        }
      } else if (type === "theme") {
        editor.setTheme(body.value);
      }
    }
  });

  vscode.postMessage({
    command: "getValue",
  });
})();
