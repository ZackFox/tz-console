const { readFile, getFileName } = require("./fileSystem");
const { writeLine } = require("./console");

function getTodosFromFile(path) {
  const fileName = getFileName(path);
  const fileData = readFile(path, "utf8");
  const lines = fileData.split(/\r?\n/);
  const todosFromFile = [];

  for (let line of lines) {
    const matched = matchComment(line);
    if (matched !== null) {
      const obj = [
        matched[4].includes("!") ? "!" : "",
        matched[2] || "",
        matched[3] || "",
        matched[4] || "",
        fileName || "",
      ];
      todosFromFile.push(obj);
    }
  }
  return todosFromFile;
}

function matchComment(line) {
  return line.match(
    /\/{2}\s?todo\s*[\s|:]\s*(([A-Za-zа-яА-я ]+\s*|\s?);\s*(\d{4}-\d{2}-\d{2}|\s?)\s*;)?\s*([A-Za-zа-яА-я 0-9!?\.,]+[^;]$)/i,
  );
}

function getTable(todos) {
  const heads = ["!", "user", "date", "comment", "fileName"];
  const limits = [1, 10, 10, 50, 15];
  const maxColumnsWidth = heads.map(h => h.length);
  let tBody = "";

  if (todos.length !== 0) {
    for (let col = 0; col < heads.length; col++) {
      for (let row of todos) {
        if (row[col].length > maxColumnsWidth[col]) {
          if (row[col].length >= limits[col]) {
            maxColumnsWidth[col] = limits[col];
            break;
          }
          maxColumnsWidth[col] = row[col].length;
        }
      }
    }

    for (let row of todos) {
      tBody += writeLine(row, maxColumnsWidth);
    }
  }

  const tHead = writeLine(heads, maxColumnsWidth);
  const dash = getSeparator("-", maxColumnsWidth);
  return `${tHead}${dash}${tBody}${todos.length !== 0 ? dash : ""}`;
}

function getSeparator(char, maxColumnsWidth) {
  const total = maxColumnsWidth.reduce((acc, n) => (acc += n + 5), 0);
  return `\n${char.repeat(total - 1)}`;
}

function fullTrim(line) {
  return line.replace(/^\s+|\s+$/gi, "").replace(/\s+/gi, " ");
}

module.exports = {
  getTodosFromFile,
  getTable,
  fullTrim,
};
