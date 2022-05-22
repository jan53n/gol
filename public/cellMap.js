/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
class CellMap {

    constructor(height, width) {
        this.width = width;
        this.height = height;
        this.length = width * height;
        this.cells = new Array(this.length).fill(0);
        this.generation = 0;
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

    getCellState(x, y) {
        const cell = (y * this.width) + x;
        return this.cells[cell] & 0x01;
    }

    *nextGeneration() {
        const cells = [...this.cells];
        const [w, h] = [this.width, this.height];
        let cell = 0;
        ++this.generation;

        for (let y = 0; y < h; y++) {
            let x = 0;
            loop1:
            do {

                while (cells[cell] == 0) {
                    cell++;
                    if (++x >= w) continue loop1;
                }

                const count = cells[cell] >> 1;

                if (cells[cell] & 0x01) {

                    if (count != 2 && count != 3) {
                        this.clearCell(x, y);
                        yield [x, y, false, this.generation];
                    }
                } else {
                    if (count == 3) {
                        this.setCell(x, y);
                        yield [x, y, true, this.generation];
                    }
                }

                cell++;

            } while (++x < w);
        }
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
let instance;

listenForAction('map/config', (action) => {

    if (started) {
        return;
    }

    started = true;

    const { width, height } = action.payload;
    instance = new CellMap(width, height);

    listenForAction('map/next', () => {
        const generation = instance.nextGeneration();

        for (const payload of generation) {
            self.postMessage({ type: 'cells/drawCell', payload });
        }
    });

    listenForAction('cells/setCell', (action) => {
        const [x, y] = action.payload;
        instance.setCell(x, y);
    });

    listenForAction('cells/deleteCell', (action) => {
        const [x, y] = action.payload;
        instance.clearCell(x, y);
    });
});