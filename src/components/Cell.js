import { useState } from 'react';
import { CELL_DEAD, CELL_LIVE } from '../config';
import './Cell.css';

function Cell({ row, column, state }) {
    const [cellState, setCellState] = useState(state);
    const isLive = cellState === CELL_LIVE;
    const backgroundColor = isLive ? 'yellow' : 'unset';

    const handleClick = () => {
        if (isLive) {
            setCellState(CELL_DEAD);
        } else {
            setCellState(CELL_LIVE);
        }
    };

    return (<div onClick={handleClick} style={{ backgroundColor, gridColumn: column, gridRow: row }}></div>);
}

export default Cell;