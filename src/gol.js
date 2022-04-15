import { List } from "immutable";


function r() {
    return parseInt(Math.random().toString()[4]);
}

export class Universe {
    constructor(options, cells) {
        this.gridSize = options.gridSize;
        this.cells = cells;
        this.intervalId = undefined;
        this.paused = false;
    }

    run(callback, interval) {
        this.clearLoop();
        this.intervalId = window.setInterval(() => {
            callback(this.next());
        }, interval);
    }

    next() {
        return { add: [[r(), r()], [r(), r()], [r(), r()], [r(), r()]], remove: [[r(), r()], [r(), r()], [r(), r()], [r(), r()]] };
    }

    clearLoop() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    push(cell) {
        this.cells = this.cells.add(List(cell));
    }
}