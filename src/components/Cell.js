import { Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { deleteCell } from '../cellSlice';
import './Cell.css';

function Cell({ row, column }) {
    const dispatch = useDispatch();

    const handler = (e) => {
        e.stopPropagation();
        dispatch(deleteCell([row, column]));
    };

    return (
        <Tooltip title={`Cell: ${row}, ${column}`}>
            <div onClick={handler} style={{ backgroundColor: 'yellow', gridColumn: column, gridRow: row }}></div>
        </Tooltip>
    );
}

export default Cell;