import { deserialize } from "./MapSerializer";

var exampleMapString = 
`p-1 p-2 p-3
p-2 p-3 p-2
p-3 p-1 p-1
p-1 e-1 p-1
p-1 p-1 p-1
===
w-0-0-0
w-1-0-0
w-2-0-1
===
0
0-1
1-1-1`;
/*
var exampleMapString = 
`p-1
p-3
===
k-0-0-0-20`;*/

const defaultMap = deserialize(exampleMapString);

export default defaultMap;