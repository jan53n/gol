import './Grid.css';
import React from 'react';
import { useSelector } from 'react-redux';
import Cell from './Cell';
import Actions from './Actions';

function Grid() {
    const zoom = useSelector(state => state.zoom.value);

    return (
        <React.Fragment>
            <div className='grid' style={{ gridTemplateColumns: `repeat(${10}, ${50 - zoom}px)`, gridTemplateRows: `repeat(${10}, ${50 - zoom}px)`, }}>
                <Cell row={4} column={4}></Cell>
            </div>

            <Actions></Actions>
        </React.Fragment>
    );
}

export default Grid;