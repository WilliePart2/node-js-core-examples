const readline = require('readline');

console.log(process.pid);

const consoleReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const write = (msg) => {
  process.stdout.write(msg);
};


const getWriter = (readlineInst, prompt) => {
  readlineInst.setPrompt(prompt);

  return {
    prompt() {
      readlineInst.prompt(true);
      return this;
    },
    message(msg) {
      write(msg);
      return this;
    },
    clearLine() {
      readlineInst.write(null, { ctrl: true, name: 'u' });
      return this;
    },
    nextLine() {
      /**
       * If use readlineInst.write() for that \n will be treated as end of the line and will trigger 'line' event
       */
      write('\n');
      return this;
    }
  };
};

let writer;

consoleReader.question('So, what is your name?\n', answer => {
  writer = getWriter(consoleReader, `${answer} > `)
    .message(`Hello ${answer}!`)
    .nextLine()
    .clearLine()
    .prompt();
});

consoleReader.on('line', (data) => {
  writer
    .message(data)
    .nextLine()
    .clearLine()
    .prompt();
});
