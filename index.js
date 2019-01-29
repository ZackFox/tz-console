const { getAllFilePaths } = require("./fileSystem");
const { getTodosFromFile, fullTrim, getTable } = require("./helpers");
const { readLine } = require("./console");

function app() {
  const filePaths = getAllFilePaths(process.cwd(), "js");
  const todos = filePaths.reduce((arr, path) => {
    arr.push(...getTodosFromFile(path));
    return arr;
  }, []);

  console.log("Please, write your command!");
  readLine(commanderInit(todos));
}

app();

function commanderInit(todos) {
  return function(input) {
    const [command, param = ""] = fullTrim(input).split(" ");
    switch (command.toLowerCase()) {
      case "show":
        showAll(todos);
        break;
      case "user":
        showByUser(todos, param.toLowerCase());
        break;
      case "date":
        showByDate(todos, param.toLowerCase());
        break;
      case "important":
        showByImportance(todos);
        break;
      case "sort": {
        sortByParam(todos, param.toLowerCase());
        break;
      }
      case "exit":
        process.exit(0);
        break;
      default:
        console.log("wrong command");
        break;
    }
  };
}

// ============================================
function showAll(todos) {
  console.log(getTable(todos));
}

// ============================================
function showByUser(todos, param) {
  let filtered = [];
  if (param !== "") {
    filtered = todos.filter(row =>
      row[1].toLowerCase().startsWith(param.toLowerCase()),
    );
  }
  console.log(getTable(filtered));
}

// ============================================
function showByDate(todos, param) {
  let filtered = [];
  if (param.search(/\d{4}(-\d{2})?(-\d{2})?/) !== -1) {
    const targetDate = Date.parse(param);
    filtered = todos.filter(t => {
      const current = t[2] !== "" ? Date.parse(t[2]) : 0;
      return current >= targetDate;
    });
  }
  console.log(getTable(filtered));
}

// ============================================
function showByImportance(todos) {
  const filtered = todos.filter(t => t[0].includes("!"));
  console.log(getTable(filtered));
}

// ============================================
function sortByParam(todos, param) {
  let sorted = [];
  if (param !== "") {
    if (param === "user") {
      sorted = todos.sort((a, b) => {
        let elemA = a[1].toLowerCase();
        let elemB = b[1].toLowerCase();

        if (elemA === elemB) return 0;
        if (elemA === "") return 1;
        if (elemB === "") return -1;
        if (elemA > elemB) return 1;
        return -1;
      });
    }
    if (param === "date") {
      sorted = todos.sort((a, b) => {
        let dateA = Date.parse(a[2]) || 0;
        let dateB = Date.parse(b[2]) || 0;
        return dateB - dateA;
      });
    }
    if (param === "importance") {
      sorted = todos.sort((a, b) => {
        const elemA = a[3].replace(/[^!]/gi, "").length;
        const elemB = b[3].replace(/[^!]/gi, "").length;
        return elemB - elemA;
      });
    }
  }
  console.log(getTable(sorted));
}

// TODO you can do it!
