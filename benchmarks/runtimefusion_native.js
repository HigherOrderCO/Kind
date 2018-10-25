var list = [];
for (var i = 0; i < 100; ++i) {
  list.push(0);
}

for (var i = 0; i < Math.pow(2, 20); ++i) {
  list = list.map(x => x + 1);
}

console.log(JSON.stringify(list));
