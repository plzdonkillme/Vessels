class GameModeTransitioner {
  static enter(viewState, entities2D, staticEntities3D, dynamicEntities3D) {
    const { mode, actions } = viewState;
    const e2D = entities2D;
    const s3D = staticEntities3D;
    if (mode === 'chooseAction') {
      e2D.move.fillStyle = '#CCCCCC';
      e2D.transfer.fillStyle = '#CCCCCC';
      e2D.attack.fillStyle = '#CCCCCC';
      e2D.end.fillStyle = '#CCCCCC';
      actions.forEach((action) => {
        if (action.name === 'move') {
          e2D.move.fillStyle = '#FFFFFF';
        } else if (action.name === 'transfer') {
          e2D.transfer.fillStyle = '#FFFFFF';
        } else if (action.name === 'attack') {
          e2D.attack.fillStyle = '#FFFFFF';
        } else if (action.name === 'end') {
          e2D.end.fillStyle = '#FFFFFF';
        }
      });
    } else if (mode === 'chooseSrc') {
      actions.forEach((action) => {
        const srcKey = `${action.src.x}_${action.src.y}`;
        s3D[srcKey].fillStyle = '#FFFFFF';
      });
    } else if (mode === 'chooseDst') {
      actions.forEach((action) => {
        const srcKey = `${action.src.x}_${action.src.y}`;
        s3D[srcKey].fillStyle = '#E6E6E6';
        const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
        dsts.forEach((dst) => {
          const dstKey = `${dst.x}_${dst.y}`;
          s3D[dstKey].fillStyle = '#FFFFFF';
        });
      });
    }
  }

  static exit(viewState, entities2D, staticEntities3D, dynamicEntities3D) {
    const { mode, actions } = viewState;
    const s3D = staticEntities3D;
    if (mode === 'chooseSrc') {
      actions.forEach((action) => {
        const srcKey = `${action.src.x}_${action.src.y}`;
        s3D[srcKey].fillStyle = '#CCCCCC';
      });
    } else if (mode === 'chooseDst') {
      actions.forEach((action) => {
        const srcKey = `${action.src.x}_${action.src.y}`;
        s3D[srcKey].fillStyle = '#CCCCCC';
        const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
        dsts.forEach((dst) => {
          const dstKey = `${dst.x}_${dst.y}`;
          s3D[dstKey].fillStyle = '#CCCCCC';
        });
      });
    }
  }

  static hover(viewState, entities2D, staticEntities3D, dynamicEntities3D) {
    const { mode, hoveredEntity, actions } = viewState;
    const e2D = entities2D;
    const s3D = staticEntities3D;
    const d3D = dynamicEntities3D;
    if (mode === 'chooseAction') {
      if (hoveredEntity === e2D.move) {
        actions.forEach((action) => {
          if (action.name === 'move') {
            e2D.move.fillStyle = '#E6E6E6';
            const srcKey = `${action.src.x}_${action.src.y}`;
            s3D[srcKey].fillStyle = '#FFFFFF';
          }
        });
      } else if (hoveredEntity === e2D.transfer) {
        actions.forEach((action) => {
          if (action.name === 'transfer') {
            e2D.transfer.fillStyle = '#E6E6E6';
            const srcKey = `${action.src.x}_${action.src.y}`;
            s3D[srcKey].fillStyle = '#FFFFFF';
          }
        });
      } else if (hoveredEntity === e2D.attack) {
        actions.forEach((action) => {
          if (action.name === 'attack') {
            e2D.attack.fillStyle = '#E6E6E6';
            const srcKey = `${action.src.x}_${action.src.y}`;
            s3D[srcKey].fillStyle = '#FFFFFF';
          }
        });
      } else if (hoveredEntity === e2D.end) {
        actions.forEach((action) => {
          if (action.name === 'end') {
            e2D.end.fillStyle = '#E6E6E6';
          }
        });
      }
    } else if (mode === 'chooseSrc') {
      if (hoveredEntity === e2D.back) {
        e2D.back.fillStyle = '#E6E6E6';
      } else {
        actions.forEach((action) => {
          const srcKey = `${action.src.x}_${action.src.y}`;
          if (s3D[srcKey] === hoveredEntity || d3D[srcKey] === hoveredEntity) {
            s3D[srcKey].fillStyle = '#E6E6E6';
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const dstKey = `${dst.x}_${dst.y}`;
              s3D[dstKey].fillStyle = '#FFFFFF';
            });
          }
        });
      }
    } else if (mode === 'chooseDst') {
      if (hoveredEntity === e2D.back) {
        e2D.back.fillStyle = '#E6E6E6';
      } else {
        actions.forEach((action) => {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          let match = false;
          dsts.forEach((dst) => {
            const dstKey = `${dst.x}_${dst.y}`;
            if (s3D[dstKey] === hoveredEntity || d3D[dstKey] === hoveredEntity) {
              match = true;
              s3D[dstKey].fillStyle = '#E6E6E6';
            }
          });
          if (match) {
            dsts.forEach((dst) => {
              const dstKey = `${dst.x}_${dst.y}`;
              s3D[dstKey].fillStyle = '#E6E6E6';
            });
          }
        });
      }
    }
  }

  static unhover(viewState, entities2D, staticEntities3D, dynamicEntities3D) {
    const { mode, hoveredEntity, actions } = viewState;
    const e2D = entities2D;
    const s3D = staticEntities3D;
    const d3D = dynamicEntities3D;
    if (mode === 'chooseAction') {
      if (hoveredEntity === e2D.move) {
        actions.forEach((action) => {
          if (action.name === 'move') {
            e2D.move.fillStyle = '#FFFFFF';
            const srcKey = `${action.src.x}_${action.src.y}`;
            s3D[srcKey].fillStyle = '#CCCCCC';
          }
        });
      } else if (hoveredEntity === e2D.transfer) {
        actions.forEach((action) => {
          if (action.name === 'transfer') {
            e2D.transfer.fillStyle = '#FFFFFF';
            const srcKey = `${action.src.x}_${action.src.y}`;
            s3D[srcKey].fillStyle = '#CCCCCC';
          }
        });
      } else if (hoveredEntity === e2D.attack) {
        actions.forEach((action) => {
          if (action.name === 'attack') {
            e2D.attack.fillStyle = '#FFFFFF';
            const srcKey = `${action.src.x}_${action.src.y}`;
            s3D[srcKey].fillStyle = '#CCCCCC';
          }
        });
      } else if (hoveredEntity === e2D.end) {
        actions.forEach((action) => {
          if (action.name === 'end') {
            e2D.end.fillStyle = '#FFFFFF';
          }
        });
      }
    } else if (mode === 'chooseSrc') {
      if (hoveredEntity === e2D.back) {
        e2D.back.fillStyle = '#FFFFFF';
      } else {
        actions.forEach((action) => {
          const srcKey = `${action.src.x}_${action.src.y}`;
          if (s3D[srcKey] === hoveredEntity || d3D[srcKey] === hoveredEntity) {
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const dstKey = `${dst.x}_${dst.y}`;
              s3D[dstKey].fillStyle = '#CCCCCC';
            });
          }
        });
        actions.forEach((action) => {
          const srcKey = `${action.src.x}_${action.src.y}`;
          s3D[srcKey].fillStyle = '#FFFFFF';
        });
      }
    } else if (mode === 'chooseDst') {
      if (hoveredEntity === e2D.back) {
        e2D.back.fillStyle = '#FFFFFF';
      } else {
        actions.forEach((action) => {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          let match = false;
          dsts.forEach((dst) => {
            const dstKey = `${dst.x}_${dst.y}`;
            if (s3D[dstKey] === hoveredEntity || d3D[dstKey] === hoveredEntity) {
              match = true;
              s3D[dstKey].fillStyle = '#FFFFFF';
            }
          });
          if (match) {
            dsts.forEach((dst) => {
              const dstKey = `${dst.x}_${dst.y}`;
              s3D[dstKey].fillStyle = '#FFFFFF';
            });
          }
        });
      }
    }
  }
}

export default GameModeTransitioner;
