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

function map_to_object(map, key = "", obj = {}) {
  switch (map._) {
    case "BitsMap.tie":
      switch (map.val._) {
        case "Maybe.none": break;
        case "Maybe.some": obj[bits_to_string(key)] = map.val.value; break;
      }
      map_to_object(map.lft, key + "0", obj);
      map_to_object(map.rgt, key + "1", obj);
      break;
    case "BitsMap.new":
      break;
  }
  return obj;
}

function bits_to_string(bits) {
  var str = "";
  for (var i = 0; i < bits.length; i += 16) {
    var binary = bits.slice(i, i + 16).split("").reverse().join("");
    str += String.fromCharCode(parseInt(binary, 2));
  }
  return str;
}


module.exports = {
  is_valid_hex,
  list_to_array,
  map_to_object,
  bits_to_string,
}
