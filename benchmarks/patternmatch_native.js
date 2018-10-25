const O = (bs) => ({ctor: "O", tail: bs});
const I = (bs) => ({ctor: "I", tail: bs});
const Z = {ctor: "Z"};

const flip = bits => {
  switch (bits.ctor) {
    case "O": return I(flip(bits.tail));
    case "I": return O(flip(bits.tail));
    case "Z": return Z;
  }
}

var bits = O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(Z))))))))))))))))))))))))))))))));
for (var i = 0; i < Math.pow(2, 20); ++i) {
  bits = flip(bits);
}

console.log(JSON.stringify(bits));
