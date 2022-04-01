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

    return (
        <React.Fragment>

            <div className='grid' style={
                {
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${zoomed}px)`,
                }
            }>
                <Cell row={4} column={4}></Cell>
            </div>

            <Actions></Actions>
        </React.Fragment>
    );
}

export default Grid;