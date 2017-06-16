import { MapSerializer } from "./Map";

var exampleMapString = 
`p-1 p-1 p-1 p-1
p-1 e-1 p-1 p-1
p-1 p-1 p-1 e-1
p-1 p-1 e-1 p-1
===
k-0-0
k-2-1`;

const serializer = new MapSerializer();
const defaultMap = serializer.deserialize(exampleMapString);

export default defaultMap;