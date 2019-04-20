/* eslint-disable no-unused-vars */
class SimpleAI {
  getAction(gamemap, player) {
    const actions = gamemap.getActions();
    const randIndex = Math.floor(Math.random() * (actions.length));
    return actions[randIndex];
  }
}

class HumanAI {}

export { SimpleAI, HumanAI };
