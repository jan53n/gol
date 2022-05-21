import { useDispatch } from 'react-redux';
import { deleteCell } from '../cellSlice';
import './Cell.css';

function Cell({ row, column }) {
    const dispatch = useDispatch();

    const handler = (e) => {
        e.stopPropagation();
        dispatch(deleteCell([row, column]));
    };

    return (<div onClick={handler} style={{ backgroundColor: 'yellow', gridColumn: column, gridRow: row }}></div>);
}

export default Cell;