// Adds a state to the list of states
// It only keeps log(N) states, where N is the amount of ticks recorded
function push(new_state, states) {
  if (states === null) {
    return {bit: 0, state: new_state, older: null};
  } else {
    var {bit, state, older} = states;
    if (bit === 0) {
      return {bit: 1, state, older};
    } else {
      return {bit: 0, state: new_state, older: push(state, older)};
    }
  }
}

// Finds the latest state that happened before a tick
function latest(before_tick, states) {
  if (states === null) {
    return null;
  } else {
    if (states.state.tick < before_tick) {
      return states.state;
    } else {
      return latest(before_tick, states.older);
    }
  }
}

module.exports = {
  push,
  latest,
};
