let number = 0;
let increasing = true;

while (true) {
  console.log(number);

  if (increasing) {
    number += 2;
    if (number > 40) {
      increasing = false;
    }
  } else {
    number -= 2;
    if (number < 0) {
      increasing = true;
    }
  }
}