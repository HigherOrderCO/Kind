function largest(numbers) {
  var largest = numbers[0]; 
  for (var i = 1; i < numbers.length; i++) { 
    if (numbers[i] > largest) { largest = numbers[i]; }
  } 
  return largest; 
}

console.log(largest([1, 8, 60, 9, 4, 5]))
