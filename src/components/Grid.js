import './Grid.css';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Cell from './Cell';
import Actions from './Actions';
import { CELL_LIVE, CELL_SIZE, GRID_SIZE } from '../config';
import { List, Set } from 'immutable';

function Grid() {
    const [cells, setCells] = useState(new Set());
    const zoomed = useSelector(({ zoom }) => {
        const _z = (zoom.value * CELL_SIZE) / 100;
        return CELL_SIZE - _z;
    });

    const handleClick = (e) => {
        const gridPosition = calculateRcFromClientCoords(e, zoomed);
        setCells((v) => v.add(
            List(gridPosition)
        ));
    }

    const cellList = cells.map(([row, column]) => {
        return (<Cell key={`${row}_${column}`} row={row} column={column} state={CELL_LIVE} />);
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
function calculateRcFromClientCoords({ clientX, clientY }, cellSize) {
    const [x, y] = [clientX - (clientX % cellSize), clientY - (clientY % cellSize)];
    return [x / cellSize, y / cellSize];
}

export default Grid;