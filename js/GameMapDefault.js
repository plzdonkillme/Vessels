import { deserialize } from './GameMapSerializer';

const exampleMapString = `
p-1 p-2 p-3
p-2 p-3 p-2
p-3 p-1 p-1
p-1 e-1 p-1
p-1 p-1 p-1
===
0-0-w-0
1-0-w-0
2-0-w-1
0-1-bs
2-1-w-1
0-2-rs
0-3-ys
===
0
0-1
1-1-1
`;

const defaultMap = deserialize(exampleMapString);

export default defaultMap;
