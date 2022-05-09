import { List } from "immutable";

export class Universe {

    constructor(getCells, gridSize) {
        this.getCells = getCells;
        this.gridSize = gridSize;
        this.worker = new Worker('./gridPartial.js');
    }

    get cells() {
        return this.getCells();
    }

    isFilled(cell) {
        return this.cells.has(List(cell));
    }

    setup() {
        this.worker.postMessage({ action: 'start', payload: this.gridSize });

        // listen to checkFilled actions
        this.worker.addEventListener('message', (event) => {
            const { action, payload } = event.data;
            if (action !== 'checkFilled') return;
            this.worker.postMessage({ action: 'isFilled', payload: { exists: this.isFilled(payload), cell: payload } });
        });
    }

    next() {
        this.setup();

        return new Promise((resolve, reject) => {
            this.worker.addEventListener('message', (event) => {
                const { action, payload } = event.data;
                if (action !== 'diff') return;
                resolve(payload);
            });
        });
    }
}