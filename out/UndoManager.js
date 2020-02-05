"use strict";
/*
Simple Javascript undo and redo.
https://github.com/ArthurClemens/Javascript-Undo-Manager
*/
Object.defineProperty(exports, "__esModule", { value: true });
function removeFromTo(array, from, to) {
    array.splice(from, !to ||
        // @ts-ignore
        1 +
            to -
            from +
            // @ts-ignore
            (!((to < 0) ^ (from >= 0)) && (to < 0 || -1) * array.length));
    return array.length;
}
class UndoManager {
    constructor(callback) {
        this.commands = [];
        this.index = -1;
        this.limit = 0;
        this.isExecuting = false;
        this.callback = callback;
    }
    execute(command, action) {
        if (!command || typeof command[action] !== "function") {
            return;
        }
        this.isExecuting = true;
        command[action]();
        this.isExecuting = false;
    }
    add(command) {
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
    undo() {
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
    redo() {
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
    clear() {
        const prevSize = this.commands.length;
        this.commands = [];
        this.index = -1;
        if (this.callback && prevSize > 0) {
            this.callback();
        }
    }
    hasUndo() {
        return this.index !== -1;
    }
    hasRedo() {
        return this.index < this.commands.length - 1;
    }
    getCommands() {
        return this.commands;
    }
    getIndex() {
        return this.index;
    }
    setLimit(limit) {
        this.limit = limit;
    }
}
exports.default = UndoManager;
//# sourceMappingURL=UndoManager.js.map