import { deserialize } from '../game_model/GameMapSerializer';
import GameMap from '../game_model/GameMap';

const exampleMapString1 = `
p_1{w_0} p_2{w_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "turnOrder": ["0", "1"],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  },
  "objective": "elimination"
}
`;

const defaultMap1 = new GameMap(deserialize(exampleMapString1));

const exampleMapString2 = `
p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_2{   } p_2{   } p_2{   } p_1{w_1} 
p_1{   } p_2{   } p_1{   } p_1{   } p_1{bs } p_1{   } p_1{   } p_2{   } p_1{   } 
p_1{w_0} p_2{   } p_1{   } p_2{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} 
p_1{   } p_2{   } p_1{   } p_1{   } p_1{rs } p_1{   } p_1{   } p_1{   } p_1{   } 
p_1{w_0} p_1{   } p_1{ys } p_2{   } p_2{   } p_2{   } p_1{ys } p_1{   } p_1{w_1} 
p_1{   } p_1{   } p_1{   } p_1{   } p_1{rs } p_1{   } p_1{   } p_1{   } p_1{   } 
p_1{w_0} p_2{   } p_1{   } p_1{   } p_1{   } p_1{   } p_2{   } p_1{   } p_1{w_1} 
p_1{   } p_1{   } p_1{   } p_1{   } p_1{bs } p_1{   } p_2{   } p_1{   } p_1{   } 
p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_2{   } p_1{   } p_1{w_1} 
===
{
  "turnOrder": ["0", "1"],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  },
  "objective": "elimination"
}
`;

const defaultMap2 = new GameMap(deserialize(exampleMapString2));

const exampleMapString3 = `
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
p_1{w_0} p_1{w_0} p_1{   } p_1{   } p_1{   } p_1{   } p_1{   } p_1{w_1} p_1{w_1} 
===
{
  "turnOrder": ["0", "1"],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  },
  "objective": "elimination"
}
`;

const defaultMap3 = new GameMap(deserialize(exampleMapString3));

export { defaultMap1, defaultMap2, defaultMap3 };
