import './Grid.css';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cell from './Cell';
import Actions from './Actions';
import { GRID_SIZE, GRID_GAP } from '../config';
import { grid } from '../gridSlice';
import { selectCells, selectGeneration, selectZoom, useZoom } from '../store';

function Grid() {
    const dispatch = useDispatch();
    const generation = useSelector(selectGeneration);
    const zoomed = useZoom();
    const cells = useSelector(selectCells);

    useEffect(() => {
        if (generation !== 0) {
            dispatch({ type: "grid/draw/completed" });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generation]);

    const handleClick = (e) => {
        const gridPosition = calculateRcFromClientCoords(e, zoomed);
        const payload = { drawables: [[...gridPosition, true]] };
        dispatch(grid.draw(payload));
    }

    const cellList = useMemo(() => {
        return cells.map(([row, column]) => {
            return (<Cell key={`${row}_${column}`} row={row} column={column} />);
        });
    }, [cells]);

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