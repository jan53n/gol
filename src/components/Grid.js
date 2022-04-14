import './Grid.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cell from './Cell';
import Actions from './Actions';
import { CELL_SIZE, GRID_SIZE } from '../config';
import { setCells } from '../store';

function Grid() {
    const dispatch = useDispatch();

    const zoomed = useSelector(({ zoom }) => {
        const _z = (zoom.value * CELL_SIZE) / 100;
        return CELL_SIZE - _z;
    });

    const cells = useSelector(({ cells }) => {
        return cells.cells;
    });

    const handleClick = (e) => {
        const gridPosition = calculateRcFromClientCoords(e, zoomed);
        dispatch(setCells(gridPosition));
    }

    const cellList = cells.map(([row, column]) => {
        return (<Cell key={`${row}_${column}`} row={row} column={column} />);
    });

    return (
        <div onClick={handleClick}>
            <div className='grid' style={
                {
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                }
            }>
                {cellList}
            </div>
            <Actions></Actions>
        </div>
    );
}

/**
 * Calculate row, column from click event coordinates
 * 
 * @param {MouseEvent} param0
 * @return {[number, number]}
 */
function calculateRcFromClientCoords(e, cellSize) {
    return [4, 4];
}

export default Grid;