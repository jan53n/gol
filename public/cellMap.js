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

    nextGeneration() {
        const cells = [...this.cells];
        const [w, h] = [this.width, this.height];
        const drawables = [];
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
                        drawables.push([x, y, false]);
                    }
                } else {
                    if (count == 3) {
                        this.setCell(x, y);
                        drawables.push([x, y, true]);
                    }
                }

                cell++;

            } while (++x < w);
        }

        return { drawables, generation: this.generation };
    }
}

/**
 * subscribe to a message type
 * 
 * @param {string} type 
 * @param {(data: {type: string, payload: unknown}) => void} callback 
 * @param {AddEventListenerOptions} options
 * @return {() => void}
 */
function listenForAction(type, callback, options = {}) {
    const listener = ({ data }) => {
        if (data.type === type) {
            callback(data);
        }
    };

    self.addEventListener('message', listener, options);

    return () => self.removeEventListener('message', listener);
}

listenForAction('start', (action) => {

    const { width, height } = action.payload;
    let instance = new CellMap(width, height);

    listenForAction('next', () => {
        const payload = instance.nextGeneration();
        self.postMessage({ type: 'diff', payload });
    });

    listenForAction('diff', ({ payload: { drawables } }) => {
        for (const [x, y, on] of drawables) {
            if (on) {
                instance.setCell(x, y);
            } else {
                instance.clearCell(x, y);
            }
        }
    });

    listenForAction('flush', () => {
        instance = undefined;
        self.terminate();
    });

}, { once: true });