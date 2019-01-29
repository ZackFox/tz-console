const readline = require("readline");

// TODO ; 2018-10-01; Можно ли написать более лаконично?
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function readLine(callback) {
  rl.on("line", callback); // TODO pe; 2015-08-10; а какая будет кодировка?
}

// TODO digi; 2016-04-08; добавить writeLine!!!
function writeLine(arr, maxColumnsWidth) {
  let result = `\n`;

  for (let col = 0; col < maxColumnsWidth.length; col++) {
    let prop = arr[col];
    const curLength = arr[col].length;

    if (curLength > maxColumnsWidth[col]) {
      prop = `${arr[col].substr(0, maxColumnsWidth[col] - 3)}...`;
    }
    if (curLength <= maxColumnsWidth[col]) {
      const collWidth = maxColumnsWidth[col] - curLength;
      prop = `${arr[col]}${String(" ").repeat(collWidth)}`;
    }
    result += `  ${prop}  |`;
  }
  return result.substr(0, result.length - 1);
}

module.exports = {
  readLine,
  writeLine,
};
