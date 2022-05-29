import { Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { grid } from '../gridSlice';
import './Cell.css';

function Cell({ row, column }) {
    const dispatch = useDispatch();

    const handler = (e) => {
        e.stopPropagation();
        const payload = { drawables: [[row, column]] };
        dispatch(grid.draw(payload));
    };

    return (
        <Tooltip disableInteractive={true} title={`Cell: ${row}, ${column}`}>
            <div onClick={handler} style={{ backgroundColor: 'yellow', gridColumn: column, gridRow: row }}></div>
        </Tooltip>
    );
}

export default Cell;