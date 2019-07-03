import chalk from "chalk";
import { format } from "util";

const colors: { [name: string]: Function } = {
  log: (text: any) => text,
  info: chalk.green.bind(chalk),
  warn: chalk.yellow.bind(chalk),
  error: chalk.red.bind(chalk)
};

function wrapConsole(originConsole: any) {
  const newConsole = Object.create(originConsole);
  ["log", "info", "warn", "error"].forEach(name => {
    const func = newConsole[name];
    newConsole[name] = (time: number, formater: string, ...args: any[]) => {
      const text = format(formater, ...args);
      const prefix = `[${new Date(time).toLocaleString()}]`;
      return func.call(newConsole, chalk.blue(prefix), colors[name](text));
    };
  });
  newConsole.debug = newConsole.log;
  return newConsole;
}

export const logger = wrapConsole(console);
