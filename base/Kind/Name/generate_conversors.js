var table = {
  'A': '000000', 'B': '100000', 'C': '010000', 'D': '110000',
  'E': '001000', 'F': '101000', 'G': '011000', 'H': '111000',
  'I': '000100', 'J': '100100', 'K': '010100', 'L': '110100',
  'M': '001100', 'N': '101100', 'O': '011100', 'P': '111100',
  'Q': '000010', 'R': '100010', 'S': '010010', 'T': '110010',
  'U': '001010', 'V': '101010', 'W': '011010', 'X': '111010',
  'Y': '000110', 'Z': '100110', 'a': '010110', 'b': '110110',
  'c': '001110', 'd': '101110', 'e': '011110', 'f': '111110',
  'g': '000001', 'h': '100001', 'i': '010001', 'j': '110001',
  'k': '001001', 'l': '101001', 'm': '011001', 'n': '111001',
  'o': '000101', 'p': '100101', 'q': '010101', 'r': '110101',
  's': '001101', 't': '101101', 'u': '011101', 'v': '111101',
  'w': '000011', 'x': '100011', 'y': '010011', 'z': '110011',
  '0': '001011', '1': '101011', '2': '011011', '3': '111011',
  '4': '000111', '5': '100111', '6': '010111', '7': '110111',
  '8': '001111', '9': '101111', '.': '011111', '_': '111111',
};
for (var key in table) {
  table[table[key]] = key;
}

function sp(tab) {
  return tab === 0 ? "" : " " + sp(tab - 1);
}

function go(bs, tab=0, depth=0, prev="") {
  var name = "bs";
  if (depth === 6) {
    let chr = table[bs.split("").reverse().join("")];
    console.log(sp(tab) + prev + "String.cons('"+chr+"',Kind.Name.from_bits(bs))");
  } else {
    console.log(sp(tab) + prev + "case " + name + " {");
    console.log(sp(tab+2) + "E: String.nil");
    go(bs+"0", tab+2, depth+1, "O: let bs = bs.pred; ");
    go(bs+"1", tab+2, depth+1, "I: let bs = bs.pred; ");
    console.log(sp(tab) + "}");
  }
};

function og(bs, i, j, tab=0, prev="") {
  if (j - i <= 1) {
    //var text = "E";
    //for (var i = bs.length - 1; i >= 0; --i) {
      //text = bs[i] === "0" ? "O("+text+")" : "I("+text+")";
    //}
    var chr = String.fromCharCode(i);
    var bts = table[chr].split("").reverse().join("");
    var txt = "Kind.Name.to_bits(name.tail)";
    for (var i = bts.length - 1; i >= 0; --i) {
      txt = bts[i] === "0" ? "O("+txt+")" : "I("+txt+")";
    }
    console.log(sp(Math.max(tab-2,0)) + prev + txt);
  } else {
    console.log(sp(Math.max(tab-2,0)) + prev + "if U16.ltn(x,"+Math.floor((j+i)/2)+"#16)");
    og(bs+"0", i, Math.floor((j+i)/2), tab+2, "then ");
    og(bs+"1", Math.floor((j+i)/2), j, tab+2, "else ");
  }
};


//.   : 46
//0-9 : 48-57
//A-Z : 65-90
//_   : 95
//a-z : 97-122
console.log("  if U16.ltn(x,47#16) then");
og("", 46, 47, 6);
console.log("  else if U16.ltn(x,58#16) then");
og("", 48, 58, 6);
console.log("  else if U16.ltn(x,91#16) then");
og("", 65, 91, 6);
console.log("  else if U16.ltn(x,96#16) then");
og("", 95, 96, 6);
console.log("  else");
og("", 97, 123, 6);
