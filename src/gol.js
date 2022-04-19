import { List } from "immutable";

const NEIGHBOURS = [
    [-1, -1],
    [-1, 0],
    [-1, +1],
    [0, -1],
    [0, +1],
    [+1, -1],
    [+1, 0],
    [+1, +1]
];

export class Universe {

    constructor(getCells, gridSize) {
        this.getCells = getCells;
        this.gridSize = gridSize;
        this.grid = this.buildGrid();
    }

    get cells() {
        return this.getCells();
    }

    buildGrid() {
        const grid = [];

        for (let r = 0; r < this.gridSize; r++) {

            for (let c = 0; c < this.gridSize; c++) {
                grid.push([r, c]);
            }
        }

        return grid;
    }

    getNeighbourCount(cell) {
        const [r, c] = cell;

        return NEIGHBOURS.reduce(
            (prev, [cR, cC]) => {
                let nCell = [r + cR, c + cC];

                if (this.isFilled(nCell)) return prev + 1;
                return prev;
            },
            0
        );
    }

    isFilled(cell) {
        return this.cells.has(List(cell));
    }

    next() {
        const diff = { add: [], remove: [] };

        for (const cell of this.grid) {
            const n = this.getNeighbourCount(cell);

            if (this.isFilled(cell)) {

                if (n < 2 || n > 3) {
                    diff.remove.push(cell);
                }
            } else {

                if (n === 3) {
                    diff.add.push(cell);
                }
            }
        }

        return diff;
    }
}