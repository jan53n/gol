import { useDispatch } from 'react-redux';
import { deleteCells } from '../store';
import './Cell.css';

function Cell({ row, column }) {
    const dispatch = useDispatch();

    const handler = (e) => {
        e.stopPropagation();
        dispatch(deleteCells([row, column]));
    };

    return (<div onClick={handler} style={{ backgroundColor: 'yellow', gridColumn: column, gridRow: row }}></div>);
}

export default Cell;