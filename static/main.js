(function() {
  document.body.style = `padding: 0; margin: 0;`;
  let app = null;
  const vscode = acquireVsCodeApi();
  const UndoManager = window.UndoManager;

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
          input: value => {
            this.onInput(value);
          },
          change: value => {
            this.onInput(value);
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
      onInput(value) {
        if (this.value !== value) {
          const oldValue = this.value;
          this.undoManager.add({
            undo: () => {
              this.value = oldValue;
              this.onPostMessage(oldValue);
            },
            redo: () => {
              this.value = value;
              this.onPostMessage(value);
            }
          });
        }
        this.value = value;
        this.onPostMessage(value);
      },
      onUndo() {
        this.undoManager.undo();
      },
      onRedo() {
        this.undoManager.redo();
      },
      onPostMessage(value) {
        vscode.postMessage({
          command: "value",
          value
        });
      },
      callback() {
        this.undo = this.undoManager.hasUndo();
        this.redo = this.undoManager.hasRedo();
      },
      reStyleSpanText() {
        const span = document.getElementById("span-text-width-erd");
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
    created() {
      this.undoManager = new UndoManager();
      this.undoManager.setCallback(this.callback);
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
