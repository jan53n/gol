function Cell({ row, column }) {
    return (<div style={{ backgroundColor: 'yellow', gridColumn: column, gridRow: row }}></div>);
}

export default Cell;