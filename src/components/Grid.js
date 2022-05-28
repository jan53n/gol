import './Grid.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cell from './Cell';
import Actions from './Actions';
import { CELL_SIZE, GRID_SIZE, GRID_GAP } from '../config';
import { draw } from '../cellSlice';

function Grid() {
    const dispatch = useDispatch();
    const generation = useSelector(({ grid: { generation } }) => generation);
    const zoomed = useSelector(({ zoom }) => {
        return CELL_SIZE - (zoom.value * CELL_SIZE) / 100;
    });
    const cells = useSelector(({ grid }) => {
        return grid.cells;
    });

    useEffect(() => {
        if (generation !== 0) dispatch({ type: "grid/draw/completed" });
    }, [generation]);

    const handleClick = (e) => {
        const gridPosition = calculateRcFromClientCoords(e, zoomed);
        const payload = { drawables: [[...gridPosition, true]] };
        dispatch(draw(payload));
    }

    const cellList = cells.map(([row, column]) => {
        return (<Cell key={`${row}_${column}`} row={row} column={column} />);
    });

    return (
        <React.Fragment>
            <div onClick={handleClick}>
                <div className='grid' style={
                    {
                        gridGap: GRID_GAP,
                        gridTemplateColumns: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                    }
                }>
                    {cellList}
                </div>
            </div>
            <Actions></Actions>
        </React.Fragment>
    );
}

/**
 * Calculate row, column from click event coordinates
 * 
 * @param {MouseEvent} param0
 * @return {[number, number]}
 */
function calculateRcFromClientCoords(e, cellSize) {
    const rect = e.target.getBoundingClientRect();
    const size = cellSize + GRID_GAP;
    const x = Math.ceil(((e.target.scrollLeft + e.clientX) - rect.left) / size);
    const y = Math.ceil(((e.target.scrollTop + e.clientY) - rect.top) / size);
    return [y, x];
}

export default Grid;