/*
Simple Javascript undo and redo.
https://github.com/ArthurClemens/Javascript-Undo-Manager
*/

interface Command {
  undo(): void;
  redo(): void;
}

type Action = "undo" | "redo";

function removeFromTo(array: Command[], from: number, to: number) {
  array.splice(
    from,
    !to ||
      // @ts-ignore
      1 +
        to -
        from +
        // @ts-ignore
        (!((to < 0) ^ (from >= 0)) && (to < 0 || -1) * array.length)
  );
  return array.length;
}

export default class UndoManager {
  private commands: Command[] = [];
  private index = -1;
  private limit = 0;
  private isExecuting = false;
  private callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
  }

  private execute(command: Command, action: Action) {
    if (!command || typeof command[action] !== "function") {
      return;
    }

    this.isExecuting = true;
    command[action]();
    this.isExecuting = false;
  }

  public add(command: Command) {
    if (this.isExecuting) {
      return;
    }

    this.commands.splice(this.index + 1, this.commands.length - this.index);
    this.commands.push(command);

    if (this.limit && this.commands.length > this.limit) {
      removeFromTo(this.commands, 0, -(this.limit + 1));
    }

    this.index = this.commands.length - 1;
    if (this.callback) {
      this.callback();
    }
  }

  public undo() {
    const command = this.commands[this.index];
    if (!command) {
      return;
    }
    this.execute(command, "undo");
    this.index -= 1;
    if (this.callback) {
      this.callback();
    }
  }

  public redo() {
    const command = this.commands[this.index + 1];
    if (!command) {
      return;
    }
    this.execute(command, "redo");
    this.index += 1;
    if (this.callback) {
      this.callback();
    }
  }

  public clear() {
    const prevSize = this.commands.length;
    this.commands = [];
    this.index = -1;
    if (this.callback && prevSize > 0) {
      this.callback();
    }
  }

  public hasUndo() {
    return this.index !== -1;
  }

  public hasRedo() {
    return this.index < this.commands.length - 1;
  }

  public getCommands() {
    return this.commands;
  }

  public getIndex() {
    return this.index;
  }

  public setLimit(limit: number) {
    this.limit = limit;
  }
}
