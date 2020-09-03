(function () {
  function getTheme(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(
      `--vscode-${name.replace(".", "-")}`
    );
  }

  document.body.style = `padding: 0; margin: 0;`;
  const container = document.querySelector("#app");
  const editor = document.createElement("erd-editor");
  const vscode = acquireVsCodeApi();
  const vscodeTheme = {
    canvas: getTheme("editor.background"),
    table: getTheme("sideBar.background"),
    tableActive: getTheme("editorCursor.foreground"),
    focus: getTheme("editorCursor.foreground"),
    // keyPK: getTheme("editor.background"),
    // keyFK: getTheme("editor.background"),
    // keyPFK: getTheme("editor.background"),
    font: getTheme("input.foreground"),
    fontActive: getTheme("inputOption.activeForeground"),
    fontPlaceholder: getTheme("input.placeholderForeground"),
    contextmenu: getTheme("menu.background"),
    contextmenuActive: getTheme("menu.selectionBackground"),
    // edit: getTheme("editorCursor.foreground"),
    columnSelect: getTheme("list.activeSelectionBackground"),
    columnActive: getTheme("list.hoverBackground"),
    minimapShadow: getTheme("widget.shadow"),
    scrollBarThumb: getTheme("scrollbarSlider.background"),
    scrollBarThumbActive: getTheme("scrollbarSlider.hoverBackground"),
    menubar: getTheme("activityBar.background"),
    visualization: getTheme("editor.background"),
  };
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
          if (message.value.themeSync) {
            editor.setTheme(Object.assign(message.value.theme, vscodeTheme));
          } else {
            editor.setTheme(message.value.theme);
          }
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
        if (body.value.themeSync) {
          editor.setTheme(Object.assign(body.value.theme, vscodeTheme));
        } else {
          editor.setTheme(body.value.theme);
        }
      }
    }
  });

  vscode.postMessage({
    command: "getValue",
  });
})();
