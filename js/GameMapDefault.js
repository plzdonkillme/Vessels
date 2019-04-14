import { deserialize } from './GameMapSerializer';
import GameMap from './GameMap';

const exampleMapString = `
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

const defaultMap = new GameMap(deserialize(exampleMapString));

export default defaultMap;
