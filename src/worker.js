import { GRID_SIZE } from "./config";

const worker = new Worker('./cellMap.js');
worker.postMessage({ type: 'config', payload: { width: GRID_SIZE, height: GRID_SIZE } });

export default worker;