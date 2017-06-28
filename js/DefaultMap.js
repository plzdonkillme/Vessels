import { MapSerializer } from "./Map";

var exampleMapString = 
`p-2 p-1 p-1 p-1
p-1 e-3 p-1 p-1
p-1 p-1 p-1 e-1
p-2 p-2 p-3 p-1
e-1 e-2 e-1 p-1
p-1 p-2 e-1 p-1
p-1 p-1 p-1 p-1
===
k-0-0-0-20
k-2-1-0-30`;

const serializer = new MapSerializer();
const defaultMap = serializer.deserialize(exampleMapString);

export default defaultMap;