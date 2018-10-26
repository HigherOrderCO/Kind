// Immutable list of 32 bits (zeros)
var bits = [0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[0,[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]];

// Flips all bits once
function flip(bits) {
  switch (bits[0]) {
    case 0  : return [1, flip(bits[1])];
    case 1  : return [0, flip(bits[1])];
    default : return [];
  }
}

// Flips all bits 2^20 times
for (var i = 0; i < Math.pow(2, 20); ++i) {
  bits = flip(bits);
}

// Prints result
console.log(JSON.stringify(bits));
