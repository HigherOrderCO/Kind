function is_valid_hex(bits, hex) {
  return new RegExp("^0x[0-9A-Fa-f]{"+Math.floor(bits/4)+"}$").test(hex)
}

function list_to_array(list) {
  var arr = [];
  while (list._ === "List.cons") {
    arr.push(list.head);
    list = list.tail;
  }
  return arr;
}

function map_to_object(map, obj = {}) {
  switch (map._) {
    case "BBL.bin":
      obj[map.key] = map.val;
      map_to_object(map.left, obj);
      map_to_object(map.right, obj);
      break;
    case "BBL.tip":
      break;
  }
  return obj;
}

// function bits_to_string(bits) {
//   var str = "";
//   for (var i = 0; i < bits.length; i += 16) {
//     var binary = bits.slice(i, i + 16).split("").reverse().join("");
//     str += String.fromCharCode(parseInt(binary, 2));
//   }
//   return str;
// }


module.exports = {
  is_valid_hex,
  list_to_array,
  map_to_object,
  // bits_to_string,
}
