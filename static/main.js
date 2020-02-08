(function() {
  document.body.style = `padding: 0; margin: 0;`;
  let app = null;
  const vscode = acquireVsCodeApi();

  // receive: extension message
  window.addEventListener("message", event => {
    const message = event.data;
    switch (message.command) {
      case "value":
        if (app !== null) {
          app.$data.value = message.value;
        }
        break;
      case "state":
        vscode.setState({ uri: message.uri });
        break;
      case "hasUndoRedo":
        if (app !== null) {
          app.$data.undo = message.undo;
          app.$data.redo = message.redo;
        }
        break;
    }
  });

  const Vuerd = window["vuerd-plugin-erd"].Vuerd;
  app = new Vue({
    el: "#app",
    data: () => ({
      width: 2000,
      height: 2000,
      value: "",
      undo: false,
      redo: false,
      undoManager: null
    }),
    render(h) {
      return h(Vuerd, {
        props: {
          value: this.value,
          width: this.width,
          height: this.height,
          focus: true,
          undo: this.undo,
          redo: this.redo
        },
        on: {
          change: value => {
            this.change(value);
          },
          undo: () => {
            this.onUndo();
          },
          redo: () => {
            this.onRedo();
          }
        }
      });
    },
    methods: {
      onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      },
      change(value) {
        this.value = value;
        vscode.postMessage({
          command: "value",
          value
        });
      },
      onUndo() {
        vscode.postMessage({
          command: "undo"
        });
      },
      onRedo() {
        vscode.postMessage({
          command: "redo"
        });
      },
      reStyleSpanText() {
        const span = document.querySelector("#span-text-width-erd");
        if (span) {
          span.style = `
          visibility: hidden;
          position: fixed;
          top: -10000px;
          font-size: 13px;
          font-family: 'Noto Sans', sans-serif;
          `;
        }
      }
    },
    mounted() {
      this.reStyleSpanText();
      window.addEventListener("resize", this.onResize);
      window.dispatchEvent(new Event("resize"));
      vscode.postMessage({
        command: "getValue"
      });
    },
    destroyed() {
      window.removeEventListener("resize", this.onResize);
    }
  });
})();
