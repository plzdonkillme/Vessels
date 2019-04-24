/* eslint-disable class-methods-use-this, no-unused-vars */
class SimpleAI {
  getAction(gamemap, player) {
    const actions = gamemap.getActions();
    const randIndex = Math.floor(Math.random() * (actions.length));
    return actions[randIndex];
  }
}

let statesSearched;

class MinimaxAI {
  getAction(gamemap, player) {
    const startTime = Date.now();
    statesSearched = 0;
    const { score, action } = this.minimax(
      gamemap,
      3,
      player,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    );
    const endTime = Date.now();
    console.log(`
      statesSearched: ${statesSearched}
      startTime: ${startTime}
      endTime: ${endTime}
    `);
    return action;
  }

  minimax(gamemap, depth, player, alpha, beta) {
    if (depth === 0 || gamemap.getWinners() !== null) {
      return { score: this.getHeuristic(gamemap, player) };
    }
    const isMaximizing = gamemap.getCurrentPlayer() === player;
    let bestScore = null;
    let bestAction = null;
    let bestMax = alpha;
    let bestMin = beta;
    const actions = gamemap.getActions();
    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i];
      gamemap.doAction(action, true);
      statesSearched += 1;
      const { score } = this.minimax(
        gamemap,
        action.name === 'end' ? depth - 1 : depth,
        player,
        bestMax,
        bestMin,
      );
      gamemap.undoAction(action, true);
      if (bestScore === null
        || (isMaximizing && score > bestScore)
        || (!isMaximizing && score < bestScore)
      ) {
        bestScore = score;
        bestAction = action;
      }
      if (isMaximizing) {
        bestMax = Math.max(bestScore, bestMax);
      } else {
        bestMin = Math.min(bestScore, bestMin);
      }
      if (bestMax >= bestMin) {
        break;
      }
    }
    return { score: bestScore, action: bestAction };
  }

  getHeuristic(gamemap, player) {
    let score = 0;
    gamemap.mapObjects.forEach((m) => {
      if (m.getPlayer() === player) {
        if (m.getShard() === null) {
          score += 1;
        } else {
          score += 1;
        }
      } else if (m.getPlayer() !== null) {
        score -= 1;
      }
    });
    return score;
  }
}

class HumanAI {}

export { SimpleAI, MinimaxAI, HumanAI };
