var list = Array(100).fill(0);

for (var i = 0; i < Math.pow(2, 20); ++i) {
  list = list.map(x => x + 1);
}

console.log(JSON.stringify(list));
