const readline = require('readline');

/**
 * readline module has possibility to redefine some events
 * clone - emits for end of input stream, EOT, SIGINT
 * pause - emits when input stream paused programmatically + SIGTSTP + SIGINT (what about resuming???)
 * result - emit when input stream resumed or SIGCONT
 * SIGINT - for SIGINT signal
 * SIGTSTP - for SIGTSTP signal
 * SIGCONT - for SIGCONT signal
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

/**
 * Will not prevent moving the process to the background
 */
rl.on('pause', _ => console.log('process will be paused'));

/**
 * Will prevent moving the process to the background
 */
rl.on('SIGTSTP', _ => console.log('prevent moving the process to the background'));

/**
 * Will not prevent ths process from moving to the background
 */
rl.on('clone', _ => console.log('process closing will not be prevented'));

/**
 * Will prevent the process from stopping
 */
rl.on('SIGINT', _ => console.log('prevent the process from stopping'));

console.log(process.pid);
