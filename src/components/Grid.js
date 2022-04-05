import './Grid.css';
import React from 'react';
import { useSelector } from 'react-redux';
import Cell from './Cell';
import Actions from './Actions';
import { CELL_SIZE, GRID_SIZE } from '../config';

function Grid() {
    const zoomed = useSelector(({ zoom }) => {
        const _z = (zoom.value * CELL_SIZE) / 100;
        return CELL_SIZE - _z;
    });

    const diff = useSelector(({ diff }) => {
        return diff;
    });

    const cells = (diff.add.map(([row, column]) => {
        return (<Cell key={`${row}_${column}`} row={row} column={column} />);
    }));

    return (
        <React.Fragment>
            <div className='grid' style={
                {
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                }
            }>
                {cells}
            </div>

            <Actions></Actions>
        </React.Fragment>
    );
}

export default Grid;