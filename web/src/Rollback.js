// Adds a state to the list of states
// It only keeps log(N) states, where N is the amount of ticks recorded
function push(states, new_state) {
  if (states === null) {
    return {bit: 0, state: new_state, older: null};
  } else {
    var {bit, state, older} = states;
    if (bit === 0) {
      return {bit: 1, state, older};
    } else {
      return {bit: 0, state: new_state, older: push(older, state)};
    }
  }
}

// Pushes the latest state *before* tick
function latest(tick, states) {
  if (states === null) {
    return null;
  } else {
    if (states.state.tick < tick) {
      return states.state;
    } else {
      return latest(tick, states.older);
    }
  }
}

function show(states) {
  var str = "";
  while (states !== null) {
    str += states.state.tick+" ";
    states = states.older;
  }
  return str;
};


var states = null;

for (var i = 0; i < 50000; ++i) {
  states = push(states, {tick: i + 100000, value: "a"});
  console.log(show(states));
}








//amazing *u*









