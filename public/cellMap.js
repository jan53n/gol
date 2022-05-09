/* eslint-disable no-restricted-globals */

class CellMap {

    constructor(height, width) {
        this.width = width;
        this.height = height;
        this.length = width * height;
        this.cells = new Array(this.length).fill(0);
        this.tempCells = new Array(this.length).fill(0);
    }

    setCell(x, y) {
        const [w, h] = [this.width, this.height];
        let xoleft, xoright, yoabove, yobelow;
        const cell = (y * w) + x;

        if (x === 0) {
            xoleft = w - 1;
        } else {
            xoleft = -1;
        }

        if (y === 0) {
            yoabove = this.length - w;
        } else {
            yoabove = -w;
        }

        if (x === (w - 1)) {
            xoright = -(w - 1);
        } else {
            xoright = 1;
        }

        if (y === (h - 1)) {
            yobelow = -(this.length - w);
        } else {
            yobelow = w;
        }

        this.cells[cell] |= 0x01;
        this.cells[(cell + yoabove + xoleft)] += 2;
        this.cells[(cell + yoabove)] += 2;
        this.cells[(cell + yoabove + xoright)] += 2;
        this.cells[(cell + xoleft)] += 2;
        this.cells[(cell + xoright)] += 2;
        this.cells[(cell + yobelow + xoleft)] += 2;
        this.cells[(cell + yobelow)] += 2;
        this.cells[(cell + yobelow + xoright)] += 2;
    }

    clearCell(x, y) {
        const [w, h] = [this.width, this.height];
        let xoleft, xoright, yoabove, yobelow;
        const cell = (y * w) + x;

        if (x === 0) {
            xoleft = w - 1;
        } else {
            xoleft = -1;
        }

        if (y === 0) {
            yoabove = this.length - w;
        } else {
            yoabove = -w;
        }

        if (x === (w - 1)) {
            xoright = -(w - 1);
        } else {
            xoright = 1;
        }

        if (y === (h - 1)) {
            yobelow = -(this.length - w);
        } else {
            yobelow = w;
        }

        this.cells[cell] &= ~0x01;
        this.cells[(cell + yoabove + xoleft)] -= 2;
        this.cells[(cell + yoabove)] -= 2;
        this.cells[(cell + yoabove + xoright)] -= 2;
        this.cells[(cell + xoleft)] -= 2;
        this.cells[(cell + xoright)] -= 2;
        this.cells[(cell + yobelow + xoleft)] -= 2;
        this.cells[(cell + yobelow)] -= 2;
        this.cells[(cell + yobelow + xoright)] -= 2;
    }

    nextGeneration() {
        const diff = { add: [], remove: [] };
        const [w, h] = [this.width, this.height];
        let cell = 0;

        for (let y = 0; y < h; y++) {
            let x = 0;
            loop1:
            do {

                while (this.cells[cell] === 0) {
                    cell++;
                    if (++x >= w) continue loop1;
                }

                const count = this.cells[cell >> 1];

                if (this.cells[cell] & 0x01) {

                    if (count !== 2 && count !== 3) {
                        this.clearCell(x, y);
                        diff.remove.push([x, y]);
                    }
                } else {
                    if (count === 3) {
                        this.setCell(x, y);
                        diff.add.push([x, y]);
                    }
                }

                cell++;

            } while (++x < w);
        }

        return diff;
    }
}

function listenForAction(type, callback) {
    self.addEventListener('message', ({ data }) => {
        if (data.type === type) {
            callback(data);
        }
    });
}

let started = false;

listenForAction('config', (action) => {

    if (started) {
        return;
    }

    started = true;

    const { width, height } = action.payload;
    const instance = new CellMap(width, height);

    listenForAction('getGeneration', () => {
        const generation = instance.nextGeneration();
        self.postMessage({ type: 'generation', payload: generation });
    });

    listenForAction('cells/setCells', (action) => {
        const [x, y] = action.payload;
        instance.setCell(x, y);
    });

    listenForAction('cells/deleteCells', (action) => {
        const [x, y] = action.payload;
        instance.clearCell(x, y);
    });
});